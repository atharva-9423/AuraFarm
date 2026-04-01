document.addEventListener('DOMContentLoaded', () => {
    // Tab switching in My Activities
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Sidebar navigation
    const navItems = document.querySelectorAll('.nav-item:not(.logout)');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Live Calendar
    const monthNameEl = document.getElementById('monthName');
    const calendarGrid = document.getElementById('calendarGrid');

    if (monthNameEl && calendarGrid) {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const currentDate = today.getDate();

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        monthNameEl.textContent = monthNames[currentMonth];

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const startOffset = firstDay === 0 ? 6 : firstDay - 1;

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

        let gridHTML = "";

        for (let i = startOffset - 1; i >= 0; i--) {
            gridHTML += `<div class="day dashed">${daysInPrevMonth - i}</div>`;
        }

        for (let i = 1; i <= daysInMonth; i++) {
            if (i < currentDate) {
                gridHTML += `<div class="day dark">${i}</div>`;
            } else if (i === currentDate) {
                gridHTML += `<div class="day active">${i}</div>`;
            } else {
                gridHTML += `<div class="day">${i}</div>`;
            }
        }

        const totalRendered = startOffset + daysInMonth;
        const nextMonthDays = totalRendered % 7 === 0 ? 0 : 7 - (totalRendered % 7);
        for (let i = 1; i <= nextMonthDays; i++) {
            gridHTML += `<div class="day dashed">${i}</div>`;
        }

        calendarGrid.innerHTML = gridHTML;
    }

    // Analyze Crop — open image picker on card click
    const analyzeCropCard = document.getElementById('analyzeCropCard');
    const cropImageInput = document.getElementById('cropImageInput');

    if (analyzeCropCard && cropImageInput) {
        analyzeCropCard.style.cursor = 'pointer';
        analyzeCropCard.addEventListener('click', () => {
            cropImageInput.click();
        });

        cropImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const validNames = ['wheat', 'sugarcane', 'corn'];
            const fileNameLower = file.name.toLowerCase();
            const isValid = validNames.some(name => fileNameLower.includes(name));

            if (!isValid) {
                const errorPopup = document.getElementById('errorPopupOverlay');
                if (errorPopup) errorPopup.classList.remove('hidden');
                cropImageInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (ev) => {
                // Determine Crop Type from filename
                let cropType = 'corn';
                if (fileNameLower.includes('wheat')) cropType = 'wheat';
                if (fileNameLower.includes('sugarcane')) cropType = 'sugarcane';

                // Show card preview
                const uploadArea = analyzeCropCard.querySelector('.upload-area');
                uploadArea.innerHTML = `<img src="${ev.target.result}" alt="Crop" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">`;

                // Launch overlay
                launchCropScan(ev.target.result, cropType);
            };
            reader.readAsDataURL(file);

            // Reset so same file can be re-picked
            cropImageInput.value = '';
        });
    }

    function launchCropScan(imageSrc, cropType) {
        const overlay = document.getElementById('cropScanOverlay');
        const previewImg = document.getElementById('scanPreviewImg');
        const scanStatus = document.getElementById('scanStatus');
        const closeBtn = document.getElementById('scanCloseBtn');

        // Dynamic strings for overlay
        const displayName = cropType.charAt(0).toUpperCase() + cropType.slice(1);
        document.querySelector('#cropScanOverlay .scan-badge').innerHTML = '<span class="scan-dot"></span>AI ' + displayName.toUpperCase() + ' ANALYSIS';
        document.querySelector('#cropScanOverlay .scan-title').innerHTML = 'Scanning ' + displayName + ' Image<span class="ellipsis"></span>';

        let metrics = [];
        let statusMessages = [];

        if (cropType === 'wheat') {
            metrics = [
                { id: 'm1', fill: 80,  val: '80%'   },
                { id: 'm2', fill: 65,  val: '65%'   },
                { id: 'm3', fill: 20,  val: 'Low'   },
                { id: 'm4', fill: 30,  val: '30%'   },
                { id: 'm5', fill: 45,  val: 'Tillering' },
            ];
            statusMessages = [
                'Initializing neural network...',
                'Preprocessing wheat image data...',
                'Detecting tiller density & canopy...',
                'Analyzing chlorophyll & leaf health...',
                'Scanning for yellow rust markers...',
                'Checking for aphid signs...',
                'Calculating growth stage & yield...',
                '✓ Wheat analysis complete!',
            ];
        } else if (cropType === 'sugarcane') {
            metrics = [
                { id: 'm1', fill: 90,  val: '90%'   },
                { id: 'm2', fill: 82,  val: '82%'   },
                { id: 'm3', fill: 5,   val: 'Minimal' },
                { id: 'm4', fill: 15,  val: '15%'   },
                { id: 'm5', fill: 60,  val: 'Grand Growth' },
            ];
            statusMessages = [
                'Initializing neural network...',
                'Preprocessing sugarcane image data...',
                'Detecting stalk height & leaf boundaries...',
                'Analyzing chlorophyll & nutrient levels...',
                'Scanning for red rot & smut markers...',
                'Checking for borer damage...',
                'Calculating cane maturity...',
                '✓ Sugarcane analysis complete!',
            ];
        } else {
            metrics = [
                { id: 'm1', fill: 85,  val: '85%'   },   // Leaf Health Index
                { id: 'm2', fill: 72,  val: '72%'   },   // Chlorophyll Level
                { id: 'm3', fill: 10,  val: 'None'  },   // Disease Detection
                { id: 'm4', fill: 40,  val: '40%'   },   // Moisture Stress
                { id: 'm5', fill: 30,  val: 'V3–V5' },   // Growth Stage
            ];
            statusMessages = [
                'Initializing neural network...',
                'Preprocessing corn image data...',
                'Detecting crop & leaf boundaries...',
                'Analyzing chlorophyll & leaf health...',
                'Scanning for disease & pest markers...',
                'Checking for Fall Armyworm signs...',
                'Calculating growth stage & yield...',
                '✓ Corn analysis complete!',
            ];
        }

        // Reset state
        previewImg.src = imageSrc;
        closeBtn.classList.remove('ready');
        metrics.forEach(m => {
            const row = document.getElementById(m.id);
            row.classList.remove('visible');
            row.querySelector('.metric-fill').style.width = '0%';
            row.querySelector('.metric-val').textContent = '—';
        });
        scanStatus.textContent = statusMessages[0];

        // Show overlay
        overlay.classList.remove('hidden');

        // Staggered metric reveals
        metrics.forEach((m, i) => {
            setTimeout(() => {
                const row = document.getElementById(m.id);
                row.classList.add('visible');
                setTimeout(() => {
                    row.querySelector('.metric-fill').style.width = m.fill + '%';
                    row.querySelector('.metric-val').textContent = m.val;
                }, 150);
            }, 600 + i * 500);
        });

        // Cycle status messages
        statusMessages.forEach((msg, i) => {
            setTimeout(() => {
                scanStatus.textContent = msg;
            }, i * 500);
        });

        // Auto-redirect to results page when complete
        setTimeout(() => {
            sessionStorage.setItem('cropAnalysisImage', imageSrc);
            sessionStorage.setItem('analyzedCropType', cropType);
            window.location.href = 'analysis.html';
        }, 600 + metrics.length * 500 + 1000); // extra 1 second to see the 100% complete state

        // Close handler in case they click it before auto-redirect
        closeBtn.onclick = () => {
            sessionStorage.setItem('cropAnalysisImage', imageSrc);
            sessionStorage.setItem('analyzedCropType', cropType);
            window.location.href = 'analysis.html';
        };
    }

    // Analyze Soil — open image picker on card click
    const analyzeSoilCard = document.getElementById('analyzeSoilCard');
    const soilImageInput = document.getElementById('soilImageInput');

    if (analyzeSoilCard && soilImageInput) {
        analyzeSoilCard.style.cursor = 'pointer';
        analyzeSoilCard.addEventListener('click', () => {
            soilImageInput.click();
        });

        soilImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (ev) => {
                // Show card preview
                const uploadArea = analyzeSoilCard.querySelector('.upload-area');
                uploadArea.innerHTML = `<img src="${ev.target.result}" alt="Soil" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">`;

                // Launch overlay
                launchSoilScan(ev.target.result);
            };
            reader.readAsDataURL(file);

            // Reset so same file can be re-picked
            soilImageInput.value = '';
        });
    }

    function launchSoilScan(imageSrc) {
        const overlay = document.getElementById('soilScanOverlay');
        const previewImg = document.getElementById('soilScanPreviewImg');
        const scanStatus = document.getElementById('soilScanStatus');
        const closeBtn = document.getElementById('soilScanCloseBtn');

        const metrics = [
            { id: 'sm1', fill: 65, val: '6.5' },
            { id: 'sm2', fill: 45, val: '45%' },
            { id: 'sm3', fill: 55, val: '55%' },
            { id: 'sm4', fill: 70, val: '70%' },
            { id: 'sm5', fill: 30, val: '30%' },
        ];

        const statusMessages = [
            'Initializing neural network...',
            'Preprocessing soil image...',
            'Analyzing soil texture...',
            'Detecting mineral content...',
            'Estimating nutrient levels...',
            'Evaluating moisture content...',
            'Generating soil report...',
            '✓ Analysis complete!',
        ];

        // Reset state
        previewImg.src = imageSrc;
        closeBtn.classList.remove('ready');
        metrics.forEach(m => {
            const row = document.getElementById(m.id);
            row.classList.remove('visible');
            row.querySelector('.metric-fill').style.width = '0%';
            row.querySelector('.metric-val').textContent = '—';
        });
        scanStatus.textContent = statusMessages[0];

        // Show overlay
        overlay.classList.remove('hidden');

        // Staggered metric reveals
        metrics.forEach((m, i) => {
            setTimeout(() => {
                const row = document.getElementById(m.id);
                row.classList.add('visible');
                setTimeout(() => {
                    row.querySelector('.metric-fill').style.width = m.fill + '%';
                    row.querySelector('.metric-val').textContent = m.val;
                }, 150);
            }, 600 + i * 500);
        });

        // Cycle status messages
        statusMessages.forEach((msg, i) => {
            setTimeout(() => {
                scanStatus.textContent = msg;
            }, i * 500);
        });

        // Auto-redirect to results page when complete
        setTimeout(() => {
            sessionStorage.setItem('soilAnalysisImage', imageSrc);
            window.location.href = 'analysis.html';
        }, 600 + metrics.length * 500 + 1000); // extra 1 second to see the 100% complete state

        // Close handler in case they click it before auto-redirect
        closeBtn.onclick = () => {
            sessionStorage.setItem('soilAnalysisImage', imageSrc);
            window.location.href = 'analysis.html';
        };
    }
});
