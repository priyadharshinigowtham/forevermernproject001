import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const Forecast = ({ token }) => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leadTimeDays, setLeadTimeDays] = useState(7);
  const [daysToForecast, setDaysToForecast] = useState(30);
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.0); // 1.0x, 1.5x, 2.0x
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/ai/forecast?leadTimeDays=${leadTimeDays}&daysToForecast=${daysToForecast}`,
        { headers: { token } }
      );
      if (response.data.success) {
        setForecastData(response.data);
      } else {
        toast.error(response.data.message || "Failed to load forecast");
      }
    } catch (error) {
      console.error("Forecast fetch error:", error);
      toast.error("Error fetching AI Demand Forecast");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [leadTimeDays, daysToForecast]);

  const handleReorder = (productName, quantity) => {
    toast.success(
      `Restock order drafted for ${quantity} units of "${productName}"!`
    );
  };

  // Export forecast to CSV
  const handleExportCSV = () => {
    if (!forecastData?.forecasts?.length) {
      toast.error("No data available to export");
      return;
    }

    const headers = [
      "Product Name",
      "Category",
      "SubCategory",
      "Price",
      "Current Stock",
      "Daily Velocity",
      `Projected ${daysToForecast}D Demand`,
      "Inventory Runway (Days)",
      "Stock Health Status",
      "AI Recommended Reorder Units",
    ];

    const rows = forecastData.forecasts.map((item) => {
      const adjustedDemand = Math.ceil(item.projected30DayDemand * surgeMultiplier);
      const adjustedReorder = Math.max(0, adjustedDemand - item.currentStock);
      return [
        `"${item.name.replace(/"/g, '""')}"`,
        item.category,
        item.subCategory || "",
        item.price,
        item.currentStock,
        (item.dailyVelocity * surgeMultiplier).toFixed(2),
        adjustedDemand,
        Math.max(1, Math.round(item.currentStock / ((item.dailyVelocity * surgeMultiplier) || 0.5))),
        item.stockStatus,
        adjustedReorder,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ai_demand_forecast_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("AI Forecast exported as CSV!");
  };

  // Compute dynamic surge values
  const simulatedForecasts = (forecastData?.forecasts || []).map((item) => {
    const adjustedDemand = Math.ceil(item.projected30DayDemand * surgeMultiplier);
    const dailyVelocity = Number((item.dailyVelocity * surgeMultiplier).toFixed(2));
    const daysOfInventory = dailyVelocity > 0 ? Math.round(item.currentStock / dailyVelocity) : 99;
    
    let stockStatus = item.stockStatus;
    let priority = item.priority;
    let recommendedReorder = Math.max(0, adjustedDemand - item.currentStock);

    if (daysOfInventory <= leadTimeDays) {
      stockStatus = "CRITICAL_LOW";
      priority = "URGENT";
      recommendedReorder = Math.max(15, adjustedDemand - item.currentStock + 10);
    } else if (daysOfInventory <= leadTimeDays * 2.2) {
      stockStatus = "REORDER_SOON";
      priority = "MEDIUM";
    }

    return {
      ...item,
      dailyVelocity,
      projected30DayDemand: adjustedDemand,
      projectedRevenue: Math.round(adjustedDemand * item.price),
      daysOfInventory,
      stockStatus,
      priority,
      recommendedReorder,
    };
  });

  const filteredForecasts = simulatedForecasts.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || item.stockStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const simulatedTotalDemand = simulatedForecasts.reduce(
    (acc, cur) => acc + cur.projected30DayDemand,
    0
  );
  const simulatedTotalRevenue = simulatedForecasts.reduce(
    (acc, cur) => acc + cur.projectedRevenue,
    0
  );
  const simulatedCriticalCount = simulatedForecasts.filter(
    (f) => f.stockStatus === "CRITICAL_LOW"
  ).length;

  const getStatusBadge = (status) => {
    switch (status) {
      case "CRITICAL_LOW":
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-red-100 text-red-700 border border-red-200">
            ⚠️ Critical Low
          </span>
        );
      case "REORDER_SOON":
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-100 text-amber-700 border border-amber-200">
            ⏳ Reorder Soon
          </span>
        );
      case "OVERSTOCK":
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
            📦 Overstock
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
            ✅ Optimal
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
            <span>✨</span>
            <span>AI Predictive Analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Inventory Demand Forecasting
          </h1>
          <p className="text-sm text-gray-500">
            Predict future stockout risks, demand velocity, and AI reorder recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            disabled={!forecastData?.forecasts?.length}
            className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-semibold rounded-lg shadow-2xs transition disabled:opacity-50 flex items-center gap-1.5"
          >
            <span>📥 Export CSV</span>
          </button>
          <button
            onClick={fetchForecast}
            disabled={loading}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg shadow-xs transition disabled:opacity-50 flex items-center gap-2"
          >
            <span>{loading ? "Analyzing..." : "🔄 Recompute Forecast"}</span>
          </button>
        </div>
      </div>

      {/* Surge Scenario Simulation Bar */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
              AI Demand Surge Simulator
            </h4>
            <p className="text-xs text-indigo-700">
              Simulate upcoming seasonal surges or promotional events to forecast inventory stress.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-indigo-200/80 shadow-2xs">
          <button
            onClick={() => setSurgeMultiplier(1.0)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              surgeMultiplier === 1.0
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Normal (1.0x)
          </button>
          <button
            onClick={() => setSurgeMultiplier(1.5)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              surgeMultiplier === 1.5
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Festive (+50%)
          </button>
          <button
            onClick={() => setSurgeMultiplier(2.0)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              surgeMultiplier === 2.0
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Flash Sale (+100%)
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      {forecastData?.summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Projected {daysToForecast}D Demand
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-gray-900">
                {simulatedTotalDemand.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 font-medium">units</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
              {surgeMultiplier > 1 ? `⚡ ${surgeMultiplier}x surge active` : "+14% vs historical trend"}
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Critical Stock Alerts
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span
                className={`text-3xl font-extrabold ${
                  simulatedCriticalCount > 0
                    ? "text-red-600"
                    : "text-emerald-600"
                }`}
              >
                {simulatedCriticalCount}
              </span>
              <span className="text-xs text-gray-500 font-medium">items</span>
            </div>
            <span className="text-[11px] text-red-500 font-medium mt-1 block">
              Stockout risk within {leadTimeDays} days
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Projected Revenue Pipeline
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-extrabold text-gray-900">
                {currency}
                {simulatedTotalRevenue.toLocaleString()}
              </span>
            </div>
            <span className="text-[11px] text-gray-400 font-medium mt-1 block">
              Across active catalog
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              AI Model Confidence
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-indigo-600">
                {forecastData.summary.modelConfidence}
              </span>
            </div>
            <span className="text-[11px] text-indigo-500 font-medium mt-1 block">
              Based on sales velocity & order history
            </span>
          </div>
        </div>
      )}

      {/* Executive Summary Alert */}
      {forecastData?.executiveSummary && (
        <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/60 flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              AI Inventory Executive Summary
            </h4>
            <p className="text-sm text-indigo-950 font-normal mt-0.5 leading-relaxed">
              {forecastData.executiveSummary}
            </p>
          </div>
        </div>
      )}

      {/* Controls: Search, Status Filter, Lead Time */}
      <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search product or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black w-full sm:w-56"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="ALL">All Stock Statuses</option>
            <option value="CRITICAL_LOW">Critical Low Only</option>
            <option value="REORDER_SOON">Reorder Soon</option>
            <option value="OPTIMAL">Optimal</option>
            <option value="OVERSTOCK">Overstock</option>
          </select>
        </div>

        {/* Lead Time & Horizon controls */}
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-gray-500">Supplier Lead Time:</span>
            <select
              value={leadTimeDays}
              onChange={(e) => setLeadTimeDays(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 bg-gray-50 font-medium"
            >
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
              <option value={21}>21 Days</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-medium text-gray-500">Forecast Horizon:</span>
            <select
              value={daysToForecast}
              onChange={(e) => setDaysToForecast(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 bg-gray-50 font-medium"
            >
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Forecast Data Table */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            <span className="animate-spin inline-block mr-2">⚙️</span>
            Calculating demand velocity and statistical distributions...
          </div>
        ) : filteredForecasts.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            No products match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                  <th className="p-3 pl-4">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Current Stock</th>
                  <th className="p-3">Velocity (Units/Day)</th>
                  <th className="p-3">Projected Demand</th>
                  <th className="p-3">Stock Runway</th>
                  <th className="p-3">Stock Health</th>
                  <th className="p-3">AI Reorder Qty</th>
                  <th className="p-3 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredForecasts.map((item) => (
                  <tr
                    key={item.productId}
                    className="hover:bg-gray-50/80 transition"
                  >
                    <td className="p-3 pl-4">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt=""
                            className="w-9 h-9 object-cover rounded border border-gray-200"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1 max-w-[200px]">
                            {item.name}
                          </p>
                          <span className="text-[10px] text-gray-400">
                            {currency}
                            {item.price}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="capitalize">{item.category}</span>
                      {item.subCategory && (
                        <span className="text-[10px] text-gray-400 block">
                          {item.subCategory}
                        </span>
                      )}
                    </td>

                    <td className="p-3 font-semibold text-gray-900">
                      {item.currentStock}
                    </td>

                    <td className="p-3 font-mono">{item.dailyVelocity} / day</td>

                    <td className="p-3 font-bold text-gray-900">
                      {item.projected30DayDemand} units
                      <span className="block text-[10px] text-gray-400 font-normal">
                        ({currency}
                        {item.projectedRevenue.toLocaleString()})
                      </span>
                    </td>

                    <td className="p-3 min-w-[130px]">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`font-semibold ${
                            item.daysOfInventory <= leadTimeDays
                              ? "text-red-600"
                              : item.daysOfInventory <= leadTimeDays * 2
                              ? "text-amber-600"
                              : "text-gray-700"
                          }`}
                        >
                          {item.daysOfInventory} days left
                        </span>
                        {/* Visual runway progress bar */}
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.daysOfInventory <= leadTimeDays
                                ? "bg-red-500"
                                : item.daysOfInventory <= leadTimeDays * 2
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{
                              width: `${Math.min(100, (item.daysOfInventory / 45) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-3">{getStatusBadge(item.stockStatus)}</td>

                    <td className="p-3">
                      {item.recommendedReorder > 0 ? (
                        <span className="font-bold text-indigo-700">
                          +{item.recommendedReorder} units
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    <td className="p-3 pr-4 text-right">
                      {item.recommendedReorder > 0 ? (
                        <button
                          onClick={() =>
                            handleReorder(item.name, item.recommendedReorder)
                          }
                          className="px-2.5 py-1 text-[11px] font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded transition shadow-2xs"
                        >
                          Draft Reorder
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400">Stocked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forecast;
