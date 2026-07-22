// ==================== DASHBOARD PAGE ====================

console.log("dashboard.js loaded");

let dashboardCharts = {
  category: null,
  monthly: null,
};

// Initialize Dashboard
document.addEventListener("DOMContentLoaded", function () {
  console.log("dashboard DOMContentLoaded");
  if (typeof setMonthInputDefault === "function") {
    setMonthInputDefault("dashboardMonth");
  }

  const monthInput = document.getElementById("dashboardMonth");
  if (monthInput) {
    monthInput.addEventListener("change", loadDashboardData);
  }

  loadDashboardData();
});

// Load Dashboard Data
async function loadDashboardData() {
  const monthInput = document.getElementById("dashboardMonth");
  const month = monthInput ? monthInput.value : "";

  try {
    const summary = await apiCall(`/api/summary?month=${month}`);
    updateSummaryCards(summary);
    displayCategoryChart(summary.category_breakdown);

    const monthlyStats = await apiCall("/api/monthly-stats");
    displayMonthlyChart(monthlyStats);

    const transactions = await apiCall(`/api/transactions?month=${month}`);
    displayRecentTransactions(transactions.slice(0, 5));

    if (window.log && typeof log.success === "function") {
      log.success("Dashboard data loaded");
    }
  } catch (error) {
    if (window.log && typeof log.error === "function") {
      log.error("Failed to load dashboard data: " + error.message);
    }
  }
}

// Update Summary Cards
function updateSummaryCards(summary) {
  const totalCredited = document.getElementById("totalCredited");
  const totalDebited = document.getElementById("totalDebited");
  const netBalance = document.getElementById("netBalance");

  if (totalCredited) {
    totalCredited.textContent = formatCurrency(summary.total_credited);
  }
  if (totalDebited) {
    totalDebited.textContent = formatCurrency(summary.total_debited);
  }
  if (netBalance) {
    const balance = summary.balance;
    netBalance.textContent = formatCurrency(Math.abs(balance));
    netBalance.style.color = balance >= 0 ? "#28a745" : "#dc3545";
  }
}

// Display Category Chart
function displayCategoryChart(categoryBreakdown) {
  const ctx = document.getElementById("categoryChart");
  if (!ctx) return;

  destroyChart(dashboardCharts.category);

  const isDarkMode = document.body.classList.contains("dark-mode");
  const colors = getChartColors(isDarkMode);
  const categories = Object.keys(categoryBreakdown || {});
  const amounts = Object.values(categoryBreakdown || {});

  if (categories.length === 0) {
    ctx.parentElement.innerHTML =
      '<p class="text-muted text-center py-5">No data available</p>';
    return;
  }

  const chartConfig = {
    type: "doughnut",
    data: {
      labels: categories,
      datasets: [
        {
          data: amounts,
          backgroundColor: getColorArray(categories.length),
          borderColor: isDarkMode ? "#2d2d2d" : "#fff",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: colors.text,
            font: { size: 12, weight: "bold" },
            padding: 15,
          },
        },
      },
    },
  };

  dashboardCharts.category = new Chart(ctx, chartConfig);
}

// Display Monthly Chart
function displayMonthlyChart(stats) {
  const ctx = document.getElementById("monthlyChart");
  if (!ctx) return;

  destroyChart(dashboardCharts.monthly);

  const isDarkMode = document.body.classList.contains("dark-mode");
  const colors = getChartColors(isDarkMode);

  const months = stats.map((s) => s.month.split(" ")[0]);
  const credited = stats.map((s) => s.credited);
  const debited = stats.map((s) => s.debited);

  const chartConfig = {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        {
          label: "Credited (Income)",
          data: credited,
          backgroundColor: colors.credited,
          borderColor: "#1e7e34",
          borderWidth: 2,
          borderRadius: 6,
        },
        {
          label: "Debited (Expense)",
          data: debited,
          backgroundColor: colors.debited,
          borderColor: "#bd2130",
          borderWidth: 2,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: colors.text,
            callback: function (value) {
              return "₹" + value;
            },
          },
          grid: { color: colors.grid },
        },
        x: {
          ticks: { color: colors.text },
          grid: { color: colors.grid },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: colors.text,
            font: { size: 12, weight: "bold" },
            padding: 15,
          },
        },
      },
    },
  };

  dashboardCharts.monthly = new Chart(ctx, chartConfig);
}

// Display Recent Transactions
function displayRecentTransactions(transactions) {
  const tbody = document.getElementById("recentTransactions");
  if (!tbody) return;

  if (!transactions || transactions.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted py-5">
          <i class="fas fa-inbox fa-2x mb-2 d-block"></i>
          No transactions this month
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = transactions
    .map(
      (t) => `
      <tr>
        <td><small class="text-muted">${formatDate(t.date)}</small></td>
        <td><span class="badge bg-info">${t.category}</span></td>
        <td><small>${t.description || "-"}</small></td>
        <td><span class="badge ${t.type === "credited" ? "bg-success" : "bg-danger"}">${t.type === "credited" ? "Credited" : "Debited"}</span></td>
        <td class="text-end"><strong class="${t.type === "credited" ? "text-success" : "text-danger"}">${t.type === "credited" ? "+" : "-"}${formatCurrency(t.amount)}</strong></td>
      </tr>
    `,
    )
    .join("");
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  setInterval(loadDashboardData, 30000);
});

// ==================== GEMINI INTEGRATION UI ====================
document.addEventListener("DOMContentLoaded", function () {
  const openBtn = document.getElementById("openGeminiBtn");
  const geminiModalEl = document.getElementById("geminiModal");
  const geminiSubmit = document.getElementById("geminiSubmit");
  const statusBadge = document.getElementById("geminiStatus");

  console.log("gemini UI init", {
    openBtn,
    geminiModalEl,
    geminiSubmit,
    statusBadge,
  });

  if (!openBtn || !geminiModalEl || !geminiSubmit) {
    console.warn("Gemini UI elements not found");
    return;
  }

  let geminiModal = null;
  if (typeof bootstrap !== "undefined") {
    geminiModal = new bootstrap.Modal(geminiModalEl);
  }

  openBtn.addEventListener("click", () => {
    console.log("openGeminiBtn clicked");
    if (statusBadge) {
      statusBadge.textContent = "Assistant: ready";
    }
    if (geminiModal) {
      geminiModal.show();
    } else {
      geminiModalEl.style.display = "block";
      geminiModalEl.classList.add("show");
    }
    const resp = document.getElementById("geminiResponse");
    if (resp) {
      resp.style.display = "none";
      resp.textContent = "";
    }
  });

  geminiSubmit.addEventListener("click", async () => {
    console.log("geminiSubmit clicked");
    const promptEl = document.getElementById("geminiPrompt");
    const respEl = document.getElementById("geminiResponse");

    if (!promptEl || !respEl) return;

    const prompt = promptEl.value.trim();

    if (!prompt) {
      respEl.style.display = "block";
      respEl.textContent = "Please enter a prompt.";
      return;
    }

    respEl.style.display = "block";
    respEl.textContent = "Thinking...";
    if (statusBadge) {
      statusBadge.textContent = "Assistant: thinking...";
    }

    try {
      const payload = { prompt };

      const r = await fetch("/api/gemini", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Gemini request completed", {
        status: r.status,
        statusText: r.statusText,
        contentType: r.headers.get("content-type"),
      });

      const ct = r.headers.get("content-type") || "";
      if (ct.includes("text/html")) {
        respEl.textContent = "Please log in to use the assistant.";
        if (statusBadge) statusBadge.textContent = "Assistant: idle";
        return;
      }

      let data = null;
      try {
        data = await r.json();
      } catch (jsonErr) {
        const text = await r.text();
        throw new Error(`Invalid JSON response: ${text}`);
      }

      if (!r.ok) {
        const msg =
          data && data.error ? data.error : `Request failed (${r.status})`;
        throw new Error(msg);
      }

      respEl.textContent =
        data && data.response ? data.response : JSON.stringify(data);
      if (statusBadge) {
        statusBadge.textContent = "Assistant: idle";
      }
    } catch (err) {
      respEl.textContent = "Error: " + (err.message || err);
      if (statusBadge) {
        statusBadge.textContent = "Assistant: error";
      }
    }
  });
});