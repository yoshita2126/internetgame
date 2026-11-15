# 6G Network Challenge

A complete, offline-capable browser game about operating a future city's 6G network. Built with HTML, CSS, JavaScript, and an animated SVG network map. No installation, API key, account, or backend is required.

## Play

Open `index.html` in a modern desktop or mobile browser. Keep this folder's files together. The separately supplied `6G-Network-Challenge.html` is a portable version with every font and script embedded; it can be opened on its own.

For a locally hosted version, serve this folder with any static web server. For example, with Python installed:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000`. The game does not send any data to a server. Local scores and saves are separate for each browser and origin; opening the file and playing through localhost use different storage.

## Your first minute

1. Select **Start Challenge**. The initial allocation is a useful starting point.
2. Watch each application's requested Gbps beside its slider. Open the allocation help icon to see its latency, reliability, and power requirements.
3. Share the spectrum budget with the six sliders. The combined allocation cannot exceed 100%. Lower another slice before expanding one when the budget is full.
4. Keep latency below 5 ms for ten consecutive seconds to earn your first mission bonus.
5. Respond to the network log. For example, an emergency surge needs more bandwidth in the emergency slice.
6. Try **AI Optimize**. Compare the predicted metrics for the same traffic snapshot, then choose whether to apply its proposal.
7. Survive the minute with network integrity above zero to advance. Complete five levels to become a 6G Master.

Arrow keys adjust a focused slider. Space pauses or resumes when focus is outside an interactive control. All help, strategy, and station dialogs pause a running game; closing them resumes it. A manually paused game stays paused. Hiding the browser tab pauses the game.

## Included features

- Animated isometric city with four selectable base stations, six device categories, moving data packets, congestion colors, and map zoom.
- Seven connected live metrics: throughput, latency, power, bandwidth usage, packet loss, reliability, and resource utilization.
- Six spectrum allocation sliders with a shared, enforced budget.
- Five increasingly demanding one-minute levels.
- Random emergency bursts, 300%-of-normal traffic spikes, base-station failures, IoT surges, and power limitations.
- Station inspection, temporary capacity boosts, and a paid reroute action for failed stations.
- Dynamic positive and negative scoring, integrity recovery/damage, mission rewards, level bonuses, game-over, and restart.
- Six randomly selected missions, with device-count and spike missions unlocking from Level 3.
- Local AI allocation simulation with an explicit comparison and apply step.
- Interactive throughput, latency, and power charts, with pointer inspection.
- Local progress, personal best, editable player names, and a leaderboard combining local runs with clearly identified fictional examples.
- Responsive desktop, tablet, and phone layouts; keyboard controls; semantic dialogs; reduced-motion support.

## Levels

| Level | Name | Devices | Normal capacity | Power limit |
|---|---|---:|---:|---:|
| 1 | 6G Beginner | 32 | 120 Gbps | 13 kW |
| 2 | Growing Network | 68 | 160 Gbps | 16.5 kW |
| 3 | Smart City | 128 | 215 Gbps | 20 kW |
| 4 | Network Crisis | 188 | 240 Gbps | 21.5 kW |
| 5 | 6G Master | 256 | 270 Gbps | 23.5 kW |

Level 4 guarantees a station failure. Level 5 guarantees a 300% spike. Event types do not repeat within one level. Completing a level adds `5 × remaining integrity` points and advancing restores up to 25 integrity.

## Simulation model

This is an educational model, not a prediction of commercial 6G performance or a standards-conformant radio simulator. Gbps values represent aggregate service slices across a city sector. Traffic changes smoothly over time and responds to discrete events. Thousands of physical IoT messages are represented by aggregate device groups on the map.

- **Slice capacity:** allocation percentage × available network capacity. A station failure removes 22% of aggregate capacity; a coordinated boost adds 12% for 12 seconds.
- **Power:** 2.4 kW base power plus each reserved slice's Gbps multiplied by its application's kW/Gbps coefficient. Boosts add a further 1.4 kW. Idle reservations still use power, encouraging efficient allocation.
- **Power throttling:** when requested power exceeds the limit, effective slice capacity is multiplied by `power limit / requested power`. The displayed power is the allocation's requested electrical draw, so over-budget allocations remain visible.
- **Throughput:** sum of the smaller of demand and effective capacity for each slice.
- **Latency:** application base latency plus a load contribution and a queueing penalty for unmet demand. Level 5 increases the queueing penalty by 16%.
- **Packet loss and reliability:** worsen as the fraction of unserved demand increases. Connections dropped are the rounded device count times the aggregate unmet-demand fraction.
- **Resource utilization:** served traffic divided by reserved capacity, as a percentage. This differs from bandwidth usage, which compares traffic to all available capacity.
- **Energy efficiency:** average throughput divided by average requested power, in Gbps/kW. The UI reports instantaneous electrical consumption in kW rather than cumulative energy in kWh.

The per-second score rewards throughput, low latency, low packet loss, useful reservations, and power headroom, and subtracts penalties for dropped devices, congestion, and excess power. A score never falls below zero. Network integrity is separate from score and falls under sustained degradation; good service restores it. Zero integrity ends the game.

## AI recommendation

The optional “AI Optimize” feature uses a deterministic local greedy heuristic. It examines one-percentage-point increments and chooses the greatest improvement to a utility function that penalizes unmet demand and missed latency targets. Emergency services, autonomous vehicles, and factories receive greater priority weights. Power is penalized, so surplus capacity can remain unallocated.

The heuristic uses the same demand snapshot and event state as the player's current strategy. It does not contact an AI service, predict future traffic, or guarantee maximum score. Its recommendations prioritize critical service quality, which can differ from maximizing aggregate throughput during congestion.

## Files and verification

- `index.html`: application shell and accessible controls.
- `styles.css`: responsive design, visual states, and animations.
- `simulation.js`: independent traffic model, optimizer, scoring, events, missions, and level progression.
- `app.js`: rendering, controls, dialogs, charts, and local storage.
- `assets/`: bundled fonts, their SIL Open Font Licenses, and favicon.
- `tests/simulation.test.cjs`: deterministic simulation regression checks.

Run the simulation checks with Node.js:

```sh
node tests/simulation.test.cjs
```

The suite checks budget legality, initial service quality, resource starvation and game-over, paused states, power throttling, failures and boosts, 300% spikes, AI constraints and critical-service priority, mission timing, complete five-level runs across twelve event seeds, and JSON state persistence.

Browser checks cover start, pause/resume, spectrum constraints, AI comparison/apply, station boost, chart switching, save restoration, responsive layouts, and the end-of-session flow.

## Persistence

Progress saves automatically after gameplay ticks and control changes. An interrupted running session restores paused. Browser privacy settings may disable local storage; gameplay still works and shows a notice. Clearing browser/site data clears that origin's progress and leaderboard. Local scores are intended for project demos and are not tamper-resistant.

Font families: Barlow Condensed, DM Sans, and Space Grotesk. Their license files are included in `assets/`.
