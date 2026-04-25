"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getSeoOverview, SeoOverview } from "@/lib/api";

const DEFAULT_DAYS = 14;

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

function formatPercent(value: number) {
  return `${(value || 0).toFixed(2)}%`;
}

function statusBadgeClass(status: "pass" | "warn" | "fail") {
  if (status === "pass") return "bg-[var(--success)]/15 text-[var(--success)]";
  if (status === "warn") return "bg-yellow-500/15 text-yellow-600";
  return "bg-[var(--error)]/15 text-[var(--error)]";
}

function getMaxCount(items: Array<{ count: number }>) {
  return items.length > 0 ? items[0].count : 1;
}

export default function StudioSeoPage() {
  const [days, setDays] = useState<number>(DEFAULT_DAYS);
  const [data, setData] = useState<SeoOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshMs = data?.pollingHintMs || 30000;

  const loadSeoData = useCallback(async (isBackgroundRefresh = false) => {
    try {
      if (!isBackgroundRefresh) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      const payload = await getSeoOverview(days);
      setData(payload);
      setLastUpdated(new Date());
      setError(payload.error || null);
    } catch {
      setError("Unable to load SEO dashboard data right now.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [days]);

  useEffect(() => {
    loadSeoData(false);
  }, [loadSeoData]);

  useEffect(() => {
    const id = window.setInterval(() => {
      loadSeoData(true);
    }, refreshMs);
    return () => window.clearInterval(id);
  }, [loadSeoData, refreshMs]);

  const topAiSources = useMemo(() => data?.sources.ai.slice(0, 6) || [], [data]);
  const topSearchSources = useMemo(() => data?.sources.search.slice(0, 6) || [], [data]);
  const topPages = useMemo(() => data?.topPages.slice(0, 8) || [], [data]);
  const trend = useMemo(() => data?.trend.slice(-14) || [], [data]);

  return (
    <div className="min-h-screen pt-10 pb-20">
      <div className="wide-width">
        <header className="mb-8 md:mb-10">
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Studio
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif mb-2">SEO Command Center</h1>
              <p className="text-[var(--muted)] text-sm md:text-base">
                Auto-refreshing visibility dashboard for search + AI traffic.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm text-[var(--muted)]">Window</label>
              <select
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value, 10))}
                className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
              </select>
              <button
                onClick={() => loadSeoData(false)}
                className="btn btn-secondary text-sm"
                disabled={loading || refreshing}
              >
                {refreshing ? "Refreshing..." : "Refresh now"}
              </button>
            </div>
          </div>

          <div className="mt-4 text-xs text-[var(--muted)]">
            <span>Auto refresh: every {Math.round(refreshMs / 1000)}s</span>
            {lastUpdated && <span> · Last update: {lastUpdated.toLocaleTimeString()}</span>}
            {data?.cached && <span> · Cached response</span>}
          </div>
        </header>

        {loading ? (
          <div className="card p-10 text-center">
            <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[var(--muted)]">Loading SEO telemetry...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="card p-4 mb-6 border border-[var(--error)]/25 bg-[var(--error)]/5">
                <p className="text-sm text-[var(--error)]">{error}</p>
              </div>
            )}

            <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
              <div className="card p-4">
                <p className="text-xs text-[var(--muted)] mb-1">Last 60m Visits</p>
                <p className="text-2xl font-serif">{formatNumber(data?.realtime.last60Minutes.totalVisits || 0)}</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-[var(--muted)] mb-1">AI Visits (60m)</p>
                <p className="text-2xl font-serif text-[var(--accent)]">{formatNumber(data?.realtime.last60Minutes.aiVisits || 0)}</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-[var(--muted)] mb-1">Search Visits (60m)</p>
                <p className="text-2xl font-serif text-[var(--success)]">{formatNumber(data?.realtime.last60Minutes.searchVisits || 0)}</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-[var(--muted)] mb-1">Unique Visitors (60m)</p>
                <p className="text-2xl font-serif">{formatNumber(data?.realtime.last60Minutes.uniqueVisitors || 0)}</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-[var(--muted)] mb-1">Crawler Hits (60m)</p>
                <p className="text-2xl font-serif">{formatNumber(data?.crawlerActivity.last60Minutes.totalHits || 0)}</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-[var(--muted)] mb-1">Crawler Hits (24h)</p>
                <p className="text-2xl font-serif">{formatNumber(data?.crawlerActivity.last24Hours.totalHits || 0)}</p>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="card p-5">
                <p className="text-sm text-[var(--muted)] mb-1">Total Visits ({days}d)</p>
                <p className="text-3xl font-serif">{formatNumber(data?.summary.totalVisitsInRange || 0)}</p>
              </div>
              <div className="card p-5">
                <p className="text-sm text-[var(--muted)] mb-1">AI Share ({days}d)</p>
                <p className="text-3xl font-serif text-[var(--accent)]">{formatPercent(data?.summary.aiShareInRange || 0)}</p>
              </div>
              <div className="card p-5">
                <p className="text-sm text-[var(--muted)] mb-1">Search Share ({days}d)</p>
                <p className="text-3xl font-serif text-[var(--success)]">{formatPercent(data?.summary.searchShareInRange || 0)}</p>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              <div className="card p-5">
                <h2 className="text-lg font-serif mb-4">Top AI Sources</h2>
                {topAiSources.length === 0 ? (
                  <p className="text-sm text-[var(--muted)]">No AI-source visits detected in this range yet.</p>
                ) : (
                  <div className="space-y-3">
                    {topAiSources.map((item) => (
                      <div key={item.source}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="truncate max-w-[70%]">{item.source}</span>
                          <span className="text-[var(--muted)]">{formatNumber(item.count)}</span>
                        </div>
                        <div className="h-2 bg-[var(--background-alt)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--accent)]"
                            style={{ width: `${(item.count / getMaxCount(topAiSources)) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card p-5">
                <h2 className="text-lg font-serif mb-4">Top Search Sources</h2>
                {topSearchSources.length === 0 ? (
                  <p className="text-sm text-[var(--muted)]">No search-engine traffic in this range yet.</p>
                ) : (
                  <div className="space-y-3">
                    {topSearchSources.map((item) => (
                      <div key={item.source}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="truncate max-w-[70%]">{item.source}</span>
                          <span className="text-[var(--muted)]">{formatNumber(item.count)}</span>
                        </div>
                        <div className="h-2 bg-[var(--background-alt)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--success)]"
                            style={{ width: `${(item.count / getMaxCount(topSearchSources)) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              <div className="card p-5">
                <h2 className="text-lg font-serif mb-4">Top Landing Pages</h2>
                {topPages.length === 0 ? (
                  <p className="text-sm text-[var(--muted)]">No page traffic data found for this range.</p>
                ) : (
                  <div className="space-y-3">
                    {topPages.map((page) => (
                      <div key={page.page} className="flex items-center justify-between gap-3 text-sm">
                        <span className="truncate">{page.page === "/" ? "Home" : page.page}</span>
                        <span className="text-[var(--muted)]">{formatNumber(page.count)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card p-5">
                <h2 className="text-lg font-serif mb-4">Daily Trend</h2>
                {trend.length === 0 ? (
                  <p className="text-sm text-[var(--muted)]">Not enough trend data yet.</p>
                ) : (
                  <div className="space-y-2">
                    {trend.map((row) => (
                      <div key={row.date} className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center text-xs md:text-sm">
                        <span className="text-[var(--muted)]">{row.date}</span>
                        <span title="Total">{formatNumber(row.total)}</span>
                        <span className="text-[var(--accent)]" title="AI">{formatNumber(row.ai)}</span>
                        <span className="text-[var(--success)]" title="Search">{formatNumber(row.search)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="card p-5 mb-8">
              <h2 className="text-lg font-serif mb-4">Crawler Activity (Server Logs)</h2>
              {!data?.crawlerActivity.available ? (
                <p className="text-sm text-[var(--muted)]">
                  Crawler log data unavailable. Set `NGINX_ACCESS_LOG_PATH` on API server to enable this view.
                </p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Bots (Last 24h)</h3>
                    {data.crawlerActivity.last24Hours.byBot.length === 0 ? (
                      <p className="text-sm text-[var(--muted)]">No crawler hits in last 24h.</p>
                    ) : (
                      <div className="space-y-2">
                        {data.crawlerActivity.last24Hours.byBot.map((bot) => (
                          <div key={bot.bot} className="flex items-center justify-between text-sm">
                            <span>{bot.bot}</span>
                            <span className="text-[var(--muted)]">{formatNumber(bot.count)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-3">Top Crawled Paths (24h)</h3>
                    {data.crawlerActivity.last24Hours.topPaths.length === 0 ? (
                      <p className="text-sm text-[var(--muted)]">No crawler path data yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {data.crawlerActivity.last24Hours.topPaths.slice(0, 8).map((path) => (
                          <div key={path.path} className="flex items-center justify-between gap-3 text-sm">
                            <span className="truncate">{path.path}</span>
                            <span className="text-[var(--muted)]">{formatNumber(path.count)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>

            <section className="card p-5">
              <h2 className="text-lg font-serif mb-4">Automated Technical Checks</h2>
              {data?.technicalChecks.length ? (
                <div className="space-y-3">
                  {data.technicalChecks.map((check) => (
                    <div
                      key={check.name}
                      className="border border-[var(--border)] rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                    >
                      <div>
                        <p className="font-medium text-sm">{check.name}</p>
                        <p className="text-xs text-[var(--muted)]">{check.detail}</p>
                        <p className="text-xs text-[var(--muted)] mt-1">
                          {check.url} · HTTP {check.httpStatus || "n/a"} · {check.responseMs}ms
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium w-fit ${statusBadgeClass(check.status)}`}>
                        {check.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--muted)]">No technical checks available.</p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
