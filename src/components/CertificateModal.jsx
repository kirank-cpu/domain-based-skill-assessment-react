import { useMemo } from 'react'
import { useAssessment } from '../context/AssessmentContext.jsx'
import { getDomain, getLevel } from '../data/domains.js'
import { formatTimestamp } from '../utils/helpers.js'
import { X, Printer, Download, Award, BadgeCheck } from 'lucide-react'

export default function CertificateModal({ onClose }) {
  const { userName, domainId, levelId, results } = useAssessment()
  const domain = getDomain(domainId)
  const level = getLevel(levelId)
  const issuedDate = useMemo(() => new Date(), [])
  const timestamp = formatTimestamp(issuedDate)

  // Deterministic-ish certificate id for authenticity flavour.
  const certId = useMemo(() => {
    const base = `${userName}-${domainId}-${levelId}-${issuedDate.getTime()}`
    let hash = 0
    for (let i = 0; i < base.length; i++) {
      hash = (hash * 31 + base.charCodeAt(i)) >>> 0
    }
    return `QP-${hash.toString(16).toUpperCase().padStart(8, '0')}`
  }, [userName, domainId, levelId, issuedDate])

  const handlePrint = () => window.print()

  const handleDownload = () => {
    const html = buildCertificateHtml({
      userName,
      domainName: domain.name,
      levelName: level.name,
      percentage: results.percentage,
      correct: results.correct,
      total: results.total,
      timestamp,
      certId,
    })
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `QPlusProvio-Certificate-${userName.replace(/\s+/g, '_')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-3xl animate-pop-in">
        {/* Toolbar (hidden when printing) */}
        <div className="no-print mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Your Certificate</h3>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              <Printer className="h-4 w-4" />
              Print / PDF
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="inline-flex items-center justify-center rounded-lg bg-white/15 p-2 text-white backdrop-blur transition hover:bg-white/25"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Certificate */}
        <div
          id="certificate-print"
          className="relative overflow-hidden rounded-2xl bg-white p-3 shadow-2xl"
        >
          <div className="relative rounded-xl border-[6px] border-double border-brand-700/70 bg-gradient-to-br from-white to-brand-50/50 px-6 py-10 sm:px-12 sm:py-12">
            {/* Corner flourishes */}
            <Corner className="left-3 top-3" />
            <Corner className="right-3 top-3 rotate-90" />
            <Corner className="bottom-3 left-3 -rotate-90" />
            <Corner className="bottom-3 right-3 rotate-180" />

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-indigo-700 text-white shadow-lg">
                <Award className="h-8 w-8" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-700">
                Q+ Provio
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Certificate of Achievement
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                This certifies that
              </p>

              <p className="mt-5 font-serif text-3xl sm:text-4xl font-bold text-brand-800">
                {userName}
              </p>
              <div className="mx-auto mt-3 h-px w-40 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

              <p className="mx-auto mt-5 max-w-lg text-sm sm:text-base leading-relaxed text-slate-600">
                has successfully completed the{' '}
                <span className="font-semibold text-slate-900">{domain.name}</span>{' '}
                assessment at the{' '}
                <span className="font-semibold text-slate-900">{level.name}</span>{' '}
                level, achieving a score of{' '}
                <span className="font-bold text-brand-700">{results.percentage}%</span>.
              </p>

              {/* Badges */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  <BadgeCheck className="h-4 w-4" />
                  {results.correct}/{results.total} Correct
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-200">
                  Score {results.percentage}%
                </span>
              </div>

              {/* Footer meta */}
              <div className="mt-9 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
                <div className="text-center sm:text-left">
                  <p className="font-serif text-lg italic text-slate-700">Q+ Provio</p>
                  <div className="mt-1 h-px w-36 bg-slate-300" />
                  <p className="mt-1 text-xs text-slate-500">Authorized Signature</p>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-sm font-semibold text-slate-700">{timestamp}</p>
                  <div className="mt-1 h-px w-36 bg-slate-300 sm:ml-auto" />
                  <p className="mt-1 text-xs text-slate-500">Date Issued</p>
                </div>
              </div>

              <p className="mt-6 text-[11px] font-medium uppercase tracking-widest text-slate-400">
                Certificate ID: {certId}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Corner({ className = '' }) {
  return (
    <span
      className={`pointer-events-none absolute h-8 w-8 border-l-2 border-t-2 border-brand-600/50 ${className}`}
    />
  )
}

// Builds a fully self-contained HTML certificate for download (no external assets).
function buildCertificateHtml({
  userName,
  domainName,
  levelName,
  percentage,
  correct,
  total,
  timestamp,
  certId,
}) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Q+ Provio Certificate — ${escapeHtml(userName)}</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Segoe UI", system-ui, -apple-system, sans-serif; background:#eef2ff; padding:32px; display:flex; justify-content:center; }
  .cert { max-width: 820px; width:100%; background:#fff; padding:12px; border-radius:16px; box-shadow:0 20px 60px rgba(30,41,235,.15); }
  .inner { border:6px double rgba(23,49,225,.7); border-radius:12px; padding:48px 40px; text-align:center; background:linear-gradient(135deg,#fff,#f5f8ff); }
  .badge { width:64px; height:64px; margin:0 auto 16px; border-radius:50%; background:linear-gradient(135deg,#1f42f5,#4338ca); display:flex; align-items:center; justify-content:center; color:#fff; font-size:30px; }
  .brand { font-size:12px; font-weight:800; letter-spacing:.3em; color:#1731e1; text-transform:uppercase; }
  h1 { font-size:30px; color:#0f172a; margin-top:8px; }
  .sub { color:#64748b; font-size:14px; margin-top:4px; }
  .name { font-family: Georgia, "Times New Roman", serif; font-size:38px; font-weight:bold; color:#1a2bb6; margin-top:20px; }
  .rule { width:160px; height:1px; background:#cbd5e1; margin:12px auto; }
  .body { max-width:520px; margin:16px auto 0; color:#475569; line-height:1.6; }
  .body strong { color:#0f172a; }
  .score { color:#1731e1; font-weight:bold; }
  .chips { margin-top:24px; display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
  .chip { border-radius:999px; padding:6px 16px; font-size:14px; font-weight:600; }
  .chip.green { background:#ecfdf5; color:#047857; border:1px solid #a7f3d0; }
  .chip.blue { background:#eef4ff; color:#1731e1; border:1px solid #bcd2ff; }
  .footer { display:flex; justify-content:space-between; align-items:flex-end; margin-top:40px; gap:24px; flex-wrap:wrap; }
  .sig { font-family:Georgia, serif; font-style:italic; font-size:18px; color:#334155; }
  .line { width:150px; height:1px; background:#cbd5e1; margin-top:4px; }
  .cap { font-size:12px; color:#64748b; margin-top:4px; }
  .id { margin-top:24px; font-size:11px; letter-spacing:.2em; text-transform:uppercase; color:#94a3b8; }
</style>
</head>
<body>
  <div class="cert">
    <div class="inner">
      <div class="badge">&#127942;</div>
      <div class="brand">Q+ Provio</div>
      <h1>Certificate of Achievement</h1>
      <div class="sub">This certifies that</div>
      <div class="name">${escapeHtml(userName)}</div>
      <div class="rule"></div>
      <p class="body">has successfully completed the <strong>${escapeHtml(domainName)}</strong> assessment at the <strong>${escapeHtml(levelName)}</strong> level, achieving a score of <span class="score">${percentage}%</span>.</p>
      <div class="chips">
        <span class="chip green">&#10003; ${correct}/${total} Correct</span>
        <span class="chip blue">Score ${percentage}%</span>
      </div>
      <div class="footer">
        <div style="text-align:left">
          <div class="sig">Q+ Provio</div>
          <div class="line"></div>
          <div class="cap">Authorized Signature</div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:600;color:#334155;font-size:14px">${escapeHtml(timestamp)}</div>
          <div class="line" style="margin-left:auto"></div>
          <div class="cap">Date Issued</div>
        </div>
      </div>
      <div class="id">Certificate ID: ${escapeHtml(certId)}</div>
    </div>
  </div>
</body>
</html>`
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
