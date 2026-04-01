document.addEventListener('DOMContentLoaded', () => {

    // ── Load crop image passed via sessionStorage ──────────────────
    const storedImage = sessionStorage.getItem('cropAnalysisImage');
    const heroImg = document.getElementById('heroImg');
    if (storedImage && heroImg) {
        heroImg.src = storedImage;
    }

    // ── Unique analysis ID + date ──────────────────────────────────
    const idEl = document.getElementById('analysisId');
    const dateEl = document.getElementById('reportDate');
    if (idEl) idEl.textContent = 'AGR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    if (dateEl) {
        const now = new Date();
        dateEl.textContent = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    // ── Dynamic Crop Types ────────────────────────────────────────
    const cropType = sessionStorage.getItem('analyzedCropType') || 'corn';
    if (cropType && cropType !== 'corn') {
        const isWheat = cropType === 'wheat';
        const isSugarcane = cropType === 'sugarcane';
        const displayType = isWheat ? 'Wheat' : (isSugarcane ? 'Sugarcane' : cropType);

        // Update Text
        document.querySelector('.hero-info-card h1').innerHTML = `${displayType} Crop <span>Analysis</span>`;
        document.querySelector('.hero-eyebrow').textContent = `🌾 AI ${displayType.toUpperCase()} CROP REPORT`;
        
        // Update Stage & Timeline
        const heroStage = document.querySelector('.h-stat .h-val');
        if (heroStage) heroStage.textContent = isWheat ? 'Tillering' : (isSugarcane ? 'Grand Growth' : 'Mid Stage');

        // Update Fertilizer details slightly
        const ferts = document.querySelectorAll('.fert-name');
        if (ferts.length >= 2) {
            ferts[0].textContent = isWheat ? 'Urea (N) - Wheat Mix' : (isSugarcane ? 'Urea Heavy Dose' : 'Urea (Nitrogen)');
        }

        // Update disease detections to reflect non-corn wording
        const armyworm = document.querySelector('.detection-item.warn .det-name');
        if (armyworm) {
            armyworm.innerHTML = isWheat ? '🚨 Aphids' : (isSugarcane ? '🚨 Red Rot Risk' : '🚨 Pest Risk');
        }

        // Update tip boxes to mention the new crop
        document.querySelectorAll('.tip-box').forEach(bg => {
            bg.innerHTML = bg.innerHTML.replace(/corn/gi, displayType.toLowerCase());
        });
        document.querySelectorAll('.good-alert').forEach(bg => {
            bg.innerHTML = bg.innerHTML.replace(/corn/gi, displayType.toLowerCase());
        });

        // Update growth timeline
        const timelineSteps = document.querySelectorAll('.growth-timeline .tl-step');
        if (timelineSteps.length === 5) {
            if (isWheat) {
                timelineSteps[2].textContent = 'Tillering';
                timelineSteps[3].textContent = 'Heading';
            }
            // Sugarcane timeline completely rewritten below
        }

        // --- FULL SUGARCANE OVERRIDE ---
        if (isSugarcane) {
            document.querySelector('.hero-eyebrow').textContent = '🌾 AI SUGARCANE CROP REPORT';
            document.querySelector('.hero-info-card h1').innerHTML = `Sugarcane Crop <span>Analysis</span>`;
            document.querySelector('.hero-sub').innerHTML = `Detailed diagnostics from multi-spectral models. Crop status is currently evaluated as <strong>Healthy</strong>.`;
            document.querySelector('.hero-stats').innerHTML = `
                <div class="h-stat"><span class="h-val">Tillering</span><span class="h-label">Stage</span></div>
                <div class="h-divider"></div>
                <div class="h-stat"><span class="h-val">None</span><span class="h-label">Risk</span></div>
                <div class="h-divider"></div>
                <div class="h-stat"><span class="h-val">85%</span><span class="h-label">Confidence</span></div>
            `;

            document.getElementById('sec-fertilizer').innerHTML = `
                <div class="card-header-line">
                    <div class="card-icon green"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="m8 8 4-6 4 6"/><rect x="3" y="14" width="18" height="7" rx="1"/></svg></div>
                    <h2>Fertilizer Recommendation</h2>
                </div>
                <div class="split-table" style="margin-top:0;">
                    <div class="split-row header-row">
                        <span>Application Stage</span><span>Urea (N)</span><span>DAP (P)</span><span>MOP (K)</span>
                    </div>
                    <div class="split-row">
                        <span>Basal (At Planting)</span><span>20%</span><span>100%</span><span>50%</span>
                    </div>
                    <div class="split-row">
                        <span>1st Top Dress (30–45 DAP)</span><span>30%</span><span>—</span><span>—</span>
                    </div>
                    <div class="split-row">
                        <span>2nd Top Dress (60–75 DAP)</span><span>50%</span><span>—</span><span>50%</span>
                    </div>
                </div>
                <div class="tip-box">👉 Bonus: Add Zinc Sulphate (ZnSO₄) once if leaves show yellowing.</div>
            `;

            document.getElementById('sec-soil').innerHTML = `
                <div class="card-header-line">
                    <div class="card-icon orange"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/></svg></div>
                    <h2>Soil Suitability</h2>
                </div>
                <div class="soil-gauge-row">
                    <div class="gauge-wrap">
                        <svg viewBox="0 0 100 60" class="gauge-svg">
                            <path d="M10 55 A45 45 0 0 1 90 55" fill="none" stroke="#2b2d31" stroke-width="12" stroke-linecap="round"/>
                            <path d="M10 55 A45 45 0 0 1 90 55" fill="none" stroke="#C5F255" stroke-width="12" stroke-linecap="round" stroke-dasharray="141" stroke-dashoffset="17" class="gauge-progress"/>
                        </svg>
                        <div class="gauge-val">88%</div>
                        <div class="gauge-label">Suitability</div>
                    </div>
                    <div class="soil-params">
                        <div class="soil-param-row"><span>pH Level</span><span class="soil-val good">6.0 – 7.8 ✅</span></div>
                        <div class="soil-param-row"><span>Organic Matter</span><span class="soil-val warn">Medium</span></div>
                        <div class="soil-param-row"><span>Drainage</span><span class="soil-val good">Good</span></div>
                        <div class="soil-param-row"><span>Texture</span><span class="soil-val good">Loamy / Clay Loam</span></div>
                        <div class="soil-param-row"><span>EC (mS/cm)</span><span class="soil-val good">&lt; 1.5 (Safe)</span></div>
                        <div class="soil-param-row"><span>CEC</span><span class="soil-val good">High</span></div>
                    </div>
                </div>
                <div class="tip-box">👉 Suggestion: Add FYM/compost for higher yield.</div>
            `;

            document.getElementById('sec-harvest').innerHTML = `
                <div class="card-header-line">
                    <div class="card-icon blue"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg></div>
                    <h2>Expected Harvest</h2>
                </div>
                <div class="harvest-countdown">
                    <div class="countdown-ring">
                        <svg viewBox="0 0 120 120" width="120" height="120">
                            <circle cx="60" cy="60" r="52" fill="none" stroke="#2b2d31" stroke-width="10"/>
                            <circle cx="60" cy="60" r="52" fill="none" stroke="#C5F255" stroke-width="10" stroke-dasharray="100 327" transform="rotate(-90 60 60)" class="harvest-arc"/>
                        </svg>
                        <div class="countdown-val">8–10<span>months</span></div>
                    </div>
                    <div class="harvest-details">
                        <div class="harvest-row"><span>Current Stage</span><strong>Tillering stage</strong></div>
                        <div class="harvest-row"><span>Total Duration</span><strong>10–14 months</strong></div>
                        <div class="harvest-row"><span>Yield Potential</span><strong>60–100 tons/hectare</strong></div>
                        <div class="harvest-row"><span>Confidence</span><strong>~85%</strong></div>
                    </div>
                </div>
            `;

            document.getElementById('sec-disease').innerHTML = `
                <div class="card-header-line">
                    <div class="card-icon red"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
                    <h2>Disease & Pest Detection</h2>
                </div>
                <p class="section-note good-note">✅ No visible disease in image</p>
                <div class="detection-list">
                    <div class="detection-item warn">
                        <div class="det-status warn-dot"></div>
                        <div class="det-info"><span class="det-name">⚠️ Red Rot</span><span class="det-sub">Most dangerous disease</span></div>
                        <span class="det-badge danger">High Risk</span>
                    </div>
                    <div class="detection-item safe">
                        <div class="det-status safe-dot"></div>
                        <div class="det-info"><span class="det-name">Smut & Wilt</span><span class="det-sub">Watch for symptoms</span></div>
                        <span class="det-badge safe">Watch</span>
                    </div>
                    <div class="detection-item safe">
                        <div class="det-status safe-dot"></div>
                        <div class="det-info"><span class="det-name">Early Shoot & Top Borer</span><span class="det-sub">Monitor weekly</span></div>
                        <span class="det-badge safe">Clear</span>
                    </div>
                </div>
                <div class="treatment-box">
                    <strong>🛡️ Prevention:</strong> Use Trichogramma cards · Apply Chlorpyrifos · Neem-based spray weekly · Remove infected clumps immediately
                </div>
            `;

            document.getElementById('sec-irrigation').innerHTML = `
                <div class="card-header-line">
                    <div class="card-icon blue"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a5 5 0 0 0 5-5c0-2-5-10-5-10S7 15 7 17a5 5 0 0 0 5 5z"/></svg></div>
                    <h2>Water & Irrigation</h2>
                </div>
                <div class="irr-grid" style="margin-bottom:8px;">
                    <div class="irr-stat prominent-stat">
                        <span class="irr-label">Next Irrigation In</span>
                        <span class="irr-val">7 Days</span>
                        <div class="irr-subtext">Currently: Every 7-10 days</div>
                    </div>
                    <div class="irr-stat-group">
                        <div class="irr-stat simple-stat">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#516CF5" stroke-width="2"><path d="M12 22a5 5 0 0 0 5-5c0-2-5-10-5-10S7 15 7 17a5 5 0 0 0 5 5z"/></svg>
                            <div class="i-col"><span class="irr-val">~5–7 mm</span><span class="irr-label">ET Demand</span></div>
                        </div>
                        <div class="irr-stat simple-stat">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF9B42" stroke-width="2"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41"/></svg>
                            <div class="i-col"><span class="irr-val">5–7 days</span><span class="irr-label">Critical Stages</span></div>
                        </div>
                    </div>
                </div>
                <div class="split-table">
                    <div class="split-row header-row"><span>Goal</span><span>Phase</span><span>Demand</span></div>
                    <div class="split-row"><span>Moderate</span><span>Tillering</span><span>Medium</span></div>
                    <div class="split-row"><span>Heavy water</span><span>Grand Growth</span><span>High</span></div>
                    <div class="split-row"><span>Reduce</span><span>Maturity</span><span>Low</span></div>
                </div>
                <div class="tip-box">👉 Sugarcane needs consistent moisture but no waterlogging</div>
            `;

            document.getElementById('sec-climate').innerHTML = `
                <div class="card-header-line">
                    <div class="card-icon yellow"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg></div>
                    <h2>Climate Conditions</h2>
                </div>
                <div class="climate-compare">
                    <div class="climate-col current">
                        <h3>Current (Estimated)</h3>
                        <div class="climate-param"><span>Temperature</span><strong class="good">~30–35°C ✅</strong></div>
                        <div class="climate-param"><span>Humidity</span><strong class="good">~65% ✅</strong></div>
                        <div class="climate-param"><span>Wind Speed</span><strong class="good">OK</strong></div>
                        <div class="climate-param"><span>Rainfall</span><strong class="good">Normal</strong></div>
                        <div class="climate-param"><span>Sunshine Hrs</span><strong class="good">Good</strong></div>
                        <div class="climate-param"><span>UV Index</span><strong class="good">Normal</strong></div>
                    </div>
                    <div class="climate-divider"></div>
                    <div class="climate-col ideal">
                        <h3>Ideal</h3>
                        <div class="climate-param"><span>Temperature</span><strong>25–35°C</strong></div>
                        <div class="climate-param"><span>Humidity</span><strong>60–80%</strong></div>
                        <div class="climate-param"><span>Wind Speed</span><strong>Low–Moderate</strong></div>
                        <div class="climate-param"><span>Rainfall</span><strong>Moderate</strong></div>
                        <div class="climate-param"><span>Sunshine Hrs</span><strong>8–10 hrs/day</strong></div>
                        <div class="climate-param"><span>UV Index</span><strong>Medium–High</strong></div>
                    </div>
                </div>
                <div class="climate-alert good-alert">👉 Overall: Very favorable for sugarcane growth</div>
            `;

            document.getElementById('sec-growth').innerHTML = `
                <div class="card-header-line">
                    <div class="card-icon green"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 20h20"/><path d="m5 20-1-8 5 4 3-8 3 8 5-4-1 8"/></svg></div>
                    <h2>Complete Growth Plan</h2>
                </div>
                <div class="growth-plan-grid" style="margin-top:16px;">
                    <div class="gp-week"><div class="gp-week-label"><span class="gp-status done-tag">✔ DONE</span>Month 0–1</div><div class="gp-phase-name">Germination</div><ul class="gp-tasks"><li>Root establishment</li></ul></div>
                    <div class="gp-week active-week"><div class="gp-week-label"><span class="now-tag">CURRENT</span>Month 2–3</div><div class="gp-phase-name">Tillering</div><ul class="gp-tasks"><li>Multiple shoots form</li></ul></div>
                    <div class="gp-week"><div class="gp-week-label"><span class="gp-status upcoming-tag">UPCOMING</span>Month 4–6</div><div class="gp-phase-name">Grand Growth</div><ul class="gp-tasks"><li>Fastest growth 🚀</li></ul></div>
                    <div class="gp-week"><div class="gp-week-label"><span class="gp-status upcoming-tag">UPCOMING</span>Month 7–9</div><div class="gp-phase-name">Elongation</div><ul class="gp-tasks"><li>Cane elongation</li></ul></div>
                    <div class="gp-week"><div class="gp-week-label"><span class="gp-status upcoming-tag">UPCOMING</span>Month 10–12</div><div class="gp-phase-name">Sugar Accumulation</div><ul class="gp-tasks"><li>Sugar builds up</li></ul></div>
                    <div class="gp-week"><div class="gp-week-label"><span class="gp-status upcoming-tag">UPCOMING</span>Month 12–14</div><div class="gp-phase-name">Maturity</div><ul class="gp-tasks"><li>Harvesting time</li></ul></div>
                </div>
            `;

            document.getElementById('sec-ai').innerHTML = `
                <div class="card-header-line">
                    <div class="card-icon purple"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/></svg></div>
                    <h2>AI Recommendations Summary</h2>
                </div>
                <div class="ai-summary-grid" style="margin-top:16px;">
                    <div class="ai-rec positive-rec"><div class="ai-rec-icon">✅</div><div class="ai-rec-content"><strong>Crop Health</strong><p>Crop is healthy and vigorous</p></div></div>
                    <div class="ai-rec"><div class="ai-rec-icon">🌱</div><div class="ai-rec-content"><strong>Nutrition</strong><p>Maintain timely nitrogen application</p></div></div>
                    <div class="ai-rec urgent-rec"><div class="ai-rec-icon">🚨</div><div class="ai-rec-content"><strong>Pest Warning</strong><p>Watch for red rot & borers</p></div></div>
                    <div class="ai-rec"><div class="ai-rec-icon">💧</div><div class="ai-rec-content"><strong>Watering</strong><p>Ensure regular irrigation</p></div></div>
                    <div class="ai-rec positive-rec"><div class="ai-rec-icon">🔥</div><div class="ai-rec-content"><strong>Yield Potential</strong><p>Field condition = high productivity potential</p></div></div>
                </div>
            `;
        }
    }

    // ── Animate Overall Score counter ──────────────────────────────
    const scoreEl = document.getElementById('overallScore');
    if (scoreEl) {
        let val = 0;
        const target = 85;
        const step = () => {
            val = Math.min(val + 2, target);
            scoreEl.textContent = val;
            if (val < target) requestAnimationFrame(step);
        };
        setTimeout(step, 600);
    }

    // ── Animate soil gauge on scroll ──────────────────────────────
    const gaugeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target.querySelector('.gauge-progress');
                if (fill) {
                    // full arc = 141, offset 35 ≈ 78% filled
                    fill.style.strokeDashoffset = '35';
                }
                gaugeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('.gauge-wrap').forEach(el => gaugeObserver.observe(el));

    // ── Animate harvest arc ────────────────────────────────────────
    const harvestObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const arc = entry.target.querySelector('.harvest-arc');
                if (arc) {
                    // 38/120 days ≈ 32% → dasharray 163 means ~104px of 327 circumference
                    arc.style.strokeDasharray = '104 327';
                }
                harvestObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('.harvest-countdown').forEach(el => harvestObserver.observe(el));

    // ── Animate irrigation bars ────────────────────────────────────
    const irrObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.irr-bar').forEach(bar => {
                    const h = bar.style.height;
                    bar.style.height = '0%';
                    setTimeout(() => { bar.style.height = h; }, 100);
                });
                irrObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.irr-schedule').forEach(el => irrObserver.observe(el));

    // ── Animate fertilizer bars ───────────────────────────────────
    const fertObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.fert-bar-fill').forEach(bar => {
                    const w = bar.style.width;
                    bar.style.transition = 'none';
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.transition = 'width 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
                        bar.style.width = w;
                    }, 100);
                });
                fertObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.fertilizer-card').forEach(el => fertObserver.observe(el));

});
