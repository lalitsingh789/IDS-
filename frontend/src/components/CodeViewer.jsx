import { useState, useEffect, useRef, useMemo } from "react";
import "../styles/CodeViewer.css";

const API = "http://localhost:5000/api/code";

/* Syntax tokens */
const PY_TOKENS = [
  { type: "comment", re: /(#.*)/ },
  {
    type: "string",
    re: /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/,
  },
  {
    type: "keyword",
    re: /\b(import|from|def|class|return|if|else|elif|for|while|try|except|finally|with|as|in|not|and|or|True|False|None|pass|break|continue|raise|yield|lambda|global|nonlocal|async|await)\b/,
  },
  { type: "decorator", re: /(@\w+)/ },
  {
    type: "builtin",
    re: /\b(print|len|range|int|str|float|list|dict|set|tuple|open)\b/,
  },
  { type: "number", re: /\b(\d+\.?\d*)\b/ },
  { type: "func", re: /\b([a-zA-Z_]\w*)\s*(?=\()/ },
];

const JSX_TOKENS = [
  { type: "comment", re: /(\/\/.*|\/\*[\s\S]*?\*\/)/ },
  {
    type: "string",
    re: /(`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/,
  },
  {
    type: "keyword",
    re: /\b(import|export|from|default|const|let|var|function|return|if|else|for|while|try|catch|finally|async|await|new|class)\b/,
  },
  { type: "tag", re: /(<\/?[A-Z][A-Za-z0-9]*|<\/?[a-z]+)/ },
  { type: "attr", re: /\s([a-zA-Z]+(?:=[{"])?)/ },
  { type: "number", re: /\b(\d+\.?\d*)\b/ },
  { type: "func", re: /\b([a-zA-Z_]\w*)\s*(?=\()/ },
];

const TOKEN_COLORS = {
  comment: "#4a6a5a",
  string: "#98c379",
  keyword: "#c678dd",
  decorator: "#e5c07b",
  builtin: "#61afef",
  number: "#d19a66",
  func: "#61dafb",
  tag: "#e06c75",
  attr: "#d19a66",
  plain: "#abb2bf",
};

function tokenize(code, lang) {
  const tokens =
    lang === "py" ||
    lang === "python" ||
    lang === "ipynb"
      ? PY_TOKENS
      : JSX_TOKENS;

  const parts = [];
  let rest = code;

  while (rest.length > 0) {
    let best = null;
    let bestIdx = Infinity;
    let bestLen = 0;
    let bestType = "";

    for (const { type, re } of tokens) {
      const m = rest.match(re);

      if (m && m.index < bestIdx) {
        best = m;
        bestIdx = m.index;
        bestLen = m[0].length;
        bestType = type;
      }
    }

    if (!best) {
      parts.push({
        type: "plain",
        text: rest,
      });
      break;
    }

    if (bestIdx > 0) {
      parts.push({
        type: "plain",
        text: rest.slice(0, bestIdx),
      });
    }

    parts.push({
      type: bestType,
      text: best[0],
    });

    rest = rest.slice(bestIdx + bestLen);
  }

  return parts;
}

function CodePane({ content, lang, search }) {
  const lines = content
    ? content.split("\n")
    : [];

  const highlighted = useMemo(() => {
    return lines.map((line) =>
      tokenize(line, lang)
    );
  }, [content, lang]);

  return (
    <div className="cv-code-pane">
      {lines.map((line, li) => {
        const isMatch =
          search &&
          line
            .toLowerCase()
            .includes(search.toLowerCase());

        return (
          <div
            key={li}
            className={`cv-line ${
              isMatch ? "cv-line--match" : ""
            }`}
          >
            <span className="cv-ln">
              {li + 1}
            </span>

            <span className="cv-code">
              {highlighted[li].map(
                (tok, ti) => (
                  <span
                    key={ti}
                    style={{
                      color:
                        TOKEN_COLORS[
                          tok.type
                        ] ||
                        TOKEN_COLORS.plain,
                    }}
                  >
                    {tok.text}
                  </span>
                )
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
export default function CodeViewer() {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] =
    useState(null);
  const [fileContent, setFileContent] =
    useState("");
  const [search, setSearch] =
    useState("");
  const [copied, setCopied] =
    useState(false);
  const [loading, setLoading] =
    useState(true);
  const [collapsed, setCollapsed] =
    useState({});
  const searchRef = useRef(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch(
        `${API}/files`
      );

      const data = await res.json();

      if (
        data.success &&
        data.files &&
        data.files.length > 0
      ) {
        setFiles(data.files);

        openFile(data.files[0]);
      } else {
        setFiles([]);
      }
    } catch (err) {
      console.error(
        "Fetch files error:",
        err
      );
    }

    setLoading(false);
  };

  const openFile = async (file) => {
    try {
      const res = await fetch(
        `${API}/file/${file._id}`
      );

      const data = await res.json();

      if (
        data.success &&
        data.file
      ) {
        setActiveFile(file);

        setFileContent(
          data.file.content
        );

        setSearch("");
      }
    } catch (err) {
      console.error(
        "Fetch file error:",
        err
      );
    }
  };

  const handleCopy = () => {
    if (!fileContent) return;

    navigator.clipboard.writeText(
      fileContent
    );

    setCopied(true);

    setTimeout(
      () => setCopied(false),
      2000
    );
  };

  const handleDownload = () => {
    if (!fileContent) return;

    const blob = new Blob(
      [fileContent],
      {
        type: "text/plain",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      activeFile?.name ||
      "file.txt";

    a.click();

    URL.revokeObjectURL(url);
  };

  const categories = [
    ...new Set(
      files.map(
        (f) => f.category
      )
    ),
  ];

  const toggleCategory = (
    cat
  ) => {
    setCollapsed((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };
    if (loading) {
    return (
      <div className="cv-root cv-in">
        <div
          style={{
            margin: "auto",
            color: "#00e0c8",
          }}
        >
          Loading project files...
        </div>
      </div>
    );
  }

  return (
    <div className="cv-root cv-in">
      <aside className="cv-sidebar">
        <div className="cv-sb-header">
          EXPLORER
        </div>

        <div className="cv-sb-project">
          IDS-SENTINEL
        </div>

        {categories.length === 0 ? (
          <div
            style={{
              padding: "20px",
              color: "#888",
            }}
          >
            No model files found
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat}
              className="cv-sb-group"
            >
              <button
                className="cv-sb-cat"
                onClick={() =>
                  toggleCategory(cat)
                }
              >
                {collapsed[cat]
                  ? "▶"
                  : "▼"}{" "}
                {cat}
              </button>

              {!collapsed[cat] &&
                files
                  .filter(
                    (f) =>
                      f.category === cat
                  )
                  .map((file) => (
                    <button
                      key={file._id}
                      className={`cv-sb-file ${
                        activeFile?._id ===
                        file._id
                          ? "cv-sb-file--active"
                          : ""
                      }`}
                      onClick={() =>
                        openFile(file)
                      }
                    >
                      <span className="cv-sb-file-name">
                        {file.name}
                      </span>

                      <span className="cv-sb-file-lang">
                        {file.lang}
                      </span>
                    </button>
                  ))}
            </div>
          ))
        )}
      </aside>

      <div className="cv-main">
        <div className="cv-meta">
          <div className="cv-meta-name">
            {activeFile?.name ||
              "No file selected"}
          </div>

          <div className="cv-meta-right">
            <button
              className="cv-action-btn"
              onClick={handleCopy}
            >
              {copied
                ? "COPIED"
                : "COPY"}
            </button>

            <button
              className="cv-action-btn cv-action-btn--dl"
              onClick={handleDownload}
            >
              DOWNLOAD
            </button>
          </div>
        </div>

        <div className="cv-toolbar">
          <div className="cv-search-wrap">
            <input
              ref={searchRef}
              className="cv-search"
              placeholder="Search in file..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />
          </div>
        </div>

        <div className="cv-editor">
          <CodePane
            content={fileContent}
            lang={activeFile?.lang}
            search={search}
          />
        </div>
      </div>
    </div>
  );
}