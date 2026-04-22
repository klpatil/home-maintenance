/**
 * Default Midwest home maintenance tasks.
 * Each task: { id, title, description, category, priority, estTimeMin }
 * Priority: 'high' | 'medium' | 'low'
 * Categories: Lawn, HVAC, Plumbing, Roof, Safety, Exterior, Interior, Appliance, Garage, Seasonal
 *
 * Timing is tuned for USDA zones 4b-5b (MN, WI, IA, IL, MI, IN, OH, MO, NE, ND, SD, KS).
 * Lawn timing references the "Minnesota lawn care calendar" (MN Extension).
 */

const DEFAULT_TASKS = {
  1: [ // January
    { id: 'jan-01', title: 'Test smoke & CO detectors', description: 'Press the test button on every smoke and carbon monoxide detector. Replace batteries if they chirp or are over a year old. Midwest winters mean closed houses + running furnaces — CO risk is highest now.', category: 'Safety', priority: 'high', estTimeMin: 20 },
    { id: 'jan-02', title: 'Replace furnace filter', description: 'Swap in a fresh 1" pleated filter (MERV 8-11). Furnaces work hardest in January; a clogged filter raises bills and stresses the blower motor.', category: 'HVAC', priority: 'high', estTimeMin: 10 },
    { id: 'jan-03', title: 'Check for ice dams on roof eaves', description: 'Walk around the house and look for thick ice buildup at the gutter line or icicles hanging from soffits. Ice dams mean attic heat is escaping and can cause interior water damage.', category: 'Roof', priority: 'high', estTimeMin: 15 },
    { id: 'jan-04', title: 'Inspect attic for frost or leaks', description: 'Look for frost on rafters/nails or water staining on insulation. Frost = warm moist air leaking up from living space. Add weatherstripping around attic hatch if needed.', category: 'Interior', priority: 'medium', estTimeMin: 30 },
    { id: 'jan-05', title: 'Check basement for moisture & foundation cracks', description: 'Walk the perimeter of the basement. Look for damp spots, efflorescence (white powder), or new hairline cracks. Winter freeze-thaw can widen foundation cracks.', category: 'Interior', priority: 'medium', estTimeMin: 20 },
    { id: 'jan-06', title: 'Refill water softener salt', description: 'Most Midwest municipalities have hard water. Keep the brine tank at least 1/3 full with solar or pellet salt.', category: 'Plumbing', priority: 'low', estTimeMin: 15 },
    { id: 'jan-07', title: 'Check weatherstripping on doors & windows', description: 'Feel for drafts. Replace compressed foam or torn V-strip. Caulk any gaps around window trim on the interior side.', category: 'Exterior', priority: 'medium', estTimeMin: 45 },
    { id: 'jan-08', title: 'Clean refrigerator coils', description: 'Pull the fridge out and vacuum the condenser coils on the back or bottom. Dusty coils waste energy and shorten compressor life.', category: 'Appliance', priority: 'low', estTimeMin: 20 }
  ],
  2: [ // February
    { id: 'feb-01', title: 'Replace furnace filter', description: 'February is mid-heating-season — swap the filter again if you use 1" filters. 4-5" media filters can go 3-6 months.', category: 'HVAC', priority: 'high', estTimeMin: 10 },
    { id: 'feb-02', title: 'Test sump pump', description: 'Pour a 5-gallon bucket of water into the sump pit and make sure the pump kicks on and empties it. Spring thaw is weeks away — you don\'t want a flooded basement to be the test.', category: 'Plumbing', priority: 'high', estTimeMin: 15 },
    { id: 'feb-03', title: 'Plan spring landscaping & order seeds', description: 'Sketch any lawn reseeding, garden beds, or tree planting. Order grass seed, vegetable seeds, and mulch early — popular varieties sell out by April.', category: 'Lawn', priority: 'low', estTimeMin: 60 },
    { id: 'feb-04', title: 'Inspect roof with binoculars', description: 'Scan for missing shingles, lifted flashing, or damage from winter storms. Note anything for a spring roofer visit.', category: 'Roof', priority: 'medium', estTimeMin: 15 },
    { id: 'feb-05', title: 'Vacuum bathroom & kitchen exhaust fan covers', description: 'Remove the grille, wash it, and vacuum the fan blades. Clogged exhaust fans raise indoor humidity, which contributes to ice dams in winter.', category: 'Interior', priority: 'low', estTimeMin: 20 },
    { id: 'feb-06', title: 'Check & clean humidifier', description: 'Whole-house humidifiers need their pad replaced once per season. Portable units need the tank descaled with vinegar every 2-4 weeks.', category: 'HVAC', priority: 'medium', estTimeMin: 30 },
    { id: 'feb-07', title: 'Check insulation depth in attic', description: 'Midwest target is R-49 to R-60 (roughly 16"-20" of blown cellulose or fiberglass). Top up low spots before spring.', category: 'Interior', priority: 'low', estTimeMin: 20 }
  ],
  3: [ // March
    { id: 'mar-01', title: 'Schedule HVAC/AC spring tune-up', description: 'Book now — HVAC techs are slammed the first hot week of May. Annual tune-ups catch refrigerant leaks and capacitor issues before they strand you in July.', category: 'HVAC', priority: 'high', estTimeMin: 15 },
    { id: 'mar-02', title: 'Clean gutters & downspouts', description: 'Clear leaves, shingle grit, and ice-dam debris. Make sure downspouts extend at least 4-6 feet from the foundation before spring rains.', category: 'Roof', priority: 'high', estTimeMin: 90 },
    { id: 'mar-03', title: 'Inspect roof after winter', description: 'Walk the yard and look for missing/curled shingles, damaged flashing around vents/chimneys, and granules in the gutters (sign of shingle wear).', category: 'Roof', priority: 'medium', estTimeMin: 30 },
    { id: 'mar-04', title: 'Check outdoor faucets for freeze damage', description: 'Turn on each hose bib and walk inside to listen for drips behind walls. A cracked frost-free faucet will only leak when the water is on.', category: 'Plumbing', priority: 'high', estTimeMin: 15 },
    { id: 'mar-05', title: 'Clean & organize garage', description: 'Sweep out sand and salt residue, hose down the floor on a warm day, and cycle winter gear (shovels, salt) to the back.', category: 'Garage', priority: 'low', estTimeMin: 120 },
    { id: 'mar-06', title: 'Power wash siding, deck & driveway', description: 'Wait for temps consistently above 40°F. Removes salt, mildew, and grime. Use a low-pressure tip on siding to avoid driving water under laps.', category: 'Exterior', priority: 'medium', estTimeMin: 180 },
    { id: 'mar-07', title: 'Rake lawn lightly & remove snow mold', description: 'Gently rake matted spots to lift grass blades and let them dry. Skip heavy dethatching until soil firms up.', category: 'Lawn', priority: 'medium', estTimeMin: 60 },
    { id: 'mar-08', title: 'Service mower — sharpen blade, change oil, fresh gas', description: 'Replace spark plug and air filter, sharpen or replace the blade, and put in fresh fuel with stabilizer. A sharp blade makes a huge difference in lawn health.', category: 'Lawn', priority: 'medium', estTimeMin: 45 }
  ],
  4: [ // April
    { id: 'apr-01', title: 'Apply crabgrass pre-emergent', description: 'Midwest window: mid-April to early May, before soil hits 55°F for 3 days straight. A common rule of thumb: apply when forsythia blooms drop. Water it in within 48 hours.', category: 'Lawn', priority: 'high', estTimeMin: 60 },
    { id: 'apr-02', title: 'De-winterize sprinkler system', description: 'Slowly open the main valve to prevent water hammer. Walk through each zone, check for geysers/broken heads, and adjust spray patterns.', category: 'Lawn', priority: 'high', estTimeMin: 60 },
    { id: 'apr-03', title: 'Start mowing (last week of April in MN)', description: 'Start when grass is 3-4" tall. Cut to 3" — never remove more than 1/3 of the blade at a time. Bag the first cut or two to clean up winter debris.', category: 'Lawn', priority: 'medium', estTimeMin: 60 },
    { id: 'apr-04', title: 'Reinstall window screens & wash windows', description: 'Rinse screens with a hose, wash windows inside and out while the screens are off. Check for torn screens and patch or replace.', category: 'Exterior', priority: 'low', estTimeMin: 120 },
    { id: 'apr-05', title: 'Clean dryer vent (full run to exterior)', description: 'Disconnect the dryer, run a dryer-vent brush the full length of the duct, and check the exterior flapper opens freely. Lint buildup is the #1 cause of dryer fires.', category: 'Appliance', priority: 'high', estTimeMin: 45 },
    { id: 'apr-06', title: 'Replace furnace/AC filter', description: 'Fresh filter for the transition from heating to cooling season.', category: 'HVAC', priority: 'medium', estTimeMin: 10 },
    { id: 'apr-07', title: 'Inspect deck & stain if needed', description: 'Look for loose boards, popped nails, and soft/rotted spots near ledger boards. Stain or seal if water soaks in rather than beading up.', category: 'Exterior', priority: 'medium', estTimeMin: 240 },
    { id: 'apr-08', title: 'Plant cool-season crops & prune dormant shrubs', description: 'Peas, lettuce, spinach, and onions can go in once soil is workable. Prune shrubs that bloom on new wood (hydrangea paniculata, spirea, roses) before bud break.', category: 'Lawn', priority: 'low', estTimeMin: 90 }
  ],
  5: [ // May
    { id: 'may-01', title: 'Mow weekly — keep height at 3-3.5"', description: 'Taller grass shades out weeds and develops deeper roots. Let clippings fall back into the lawn for free nitrogen.', category: 'Lawn', priority: 'medium', estTimeMin: 60 },
    { id: 'may-02', title: 'First lawn fertilization', description: 'Apply a balanced fertilizer (e.g., 24-0-6) once grass is actively growing — typically mid-May in the Upper Midwest. Skip if you used weed-and-feed with pre-emergent in April.', category: 'Lawn', priority: 'medium', estTimeMin: 45 },
    { id: 'may-03', title: 'Service AC condenser outside', description: 'Turn off power at the disconnect, rinse the condenser fins with a gentle hose spray from the inside out, and clear 2 feet of space around the unit.', category: 'HVAC', priority: 'medium', estTimeMin: 30 },
    { id: 'may-04', title: 'Deep clean grill & check propane hoses', description: 'Burn off residue, scrub grates, clean flame tamers and burner tubes. Do the soapy-water test on propane connections — bubbles mean a leak.', category: 'Exterior', priority: 'low', estTimeMin: 45 },
    { id: 'may-05', title: 'Mulch garden beds 2-3" deep', description: 'Fresh mulch conserves moisture, suppresses weeds, and moderates soil temperature. Keep it 2" off tree trunks to avoid rot.', category: 'Lawn', priority: 'low', estTimeMin: 120 },
    { id: 'may-06', title: 'Plant warm-season annuals (after May 15)', description: 'Last frost in most of the Midwest is around Mother\'s Day to May 15. Tomatoes, peppers, basil, and impatiens go in after that date.', category: 'Lawn', priority: 'low', estTimeMin: 90 },
    { id: 'may-07', title: 'Check for foundation grading & downspout runoff', description: 'After a hard rain, see where water pools. Ground should slope away 6" over the first 10 feet. Extend downspouts if water pools at the foundation.', category: 'Exterior', priority: 'medium', estTimeMin: 30 }
  ],
  6: [ // June
    { id: 'jun-01', title: 'Water lawn deeply, not daily', description: 'Target 1-1.5" of water per week including rainfall. One or two deep soaks beats daily sprinkles — encourages deeper roots.', category: 'Lawn', priority: 'medium', estTimeMin: 15 },
    { id: 'jun-02', title: 'Inspect gutters after spring storms', description: 'Heavy June thunderstorms can shake shingle debris loose. Also check for nests built over winter.', category: 'Roof', priority: 'medium', estTimeMin: 60 },
    { id: 'jun-03', title: 'Clean ceiling fans & reverse direction', description: 'Set fans to counter-clockwise (looking up) for summer — pushes air down. Wipe blades top and bottom with a damp cloth.', category: 'Interior', priority: 'low', estTimeMin: 20 },
    { id: 'jun-04', title: 'Check & adjust sprinkler coverage', description: 'Run each zone and look for dry spots, sidewalk overspray, or heads that have tilted. Head-to-head coverage is the goal.', category: 'Lawn', priority: 'medium', estTimeMin: 45 },
    { id: 'jun-05', title: 'Clean AC condensate drain line', description: 'Pour a cup of distilled vinegar down the condensate drain (usually a PVC stub near the indoor AC unit). Prevents algae clogs that can flood the air handler.', category: 'HVAC', priority: 'medium', estTimeMin: 15 },
    { id: 'jun-06', title: 'Touch up exterior paint', description: 'Warm dry weather is ideal for spot-painting trim, fascia, and shutters. Catch peeling spots before bare wood gets weathered.', category: 'Exterior', priority: 'low', estTimeMin: 180 },
    { id: 'jun-07', title: 'Deep water newly planted trees & shrubs', description: 'First-year plantings need ~10 gallons per week. A slow soak at the base beats a light sprinkle.', category: 'Lawn', priority: 'medium', estTimeMin: 30 }
  ],
  7: [ // July
    { id: 'jul-01', title: 'Raise mower height to 3.5-4"', description: 'Taller grass = shaded soil = less evaporation and fewer weed seeds germinating during Midwest July heat.', category: 'Lawn', priority: 'medium', estTimeMin: 60 },
    { id: 'jul-02', title: 'Check for & treat grub damage', description: 'Dig up a 1-square-foot patch where grass is browning. More than 8-10 grubs = treat with a labeled grub killer. Birds tearing up the yard is a giveaway.', category: 'Lawn', priority: 'medium', estTimeMin: 30 },
    { id: 'jul-03', title: 'Trim shrubs & hedges', description: 'Most shrubs tolerate a light shaping in July. Hold off on heavy pruning of spring bloomers (lilac, forsythia) — you\'d cut off next year\'s flowers.', category: 'Lawn', priority: 'low', estTimeMin: 90 },
    { id: 'jul-04', title: 'Inspect deck & railing safety', description: 'Jiggle railings, check stair treads for rot, and inspect the ledger board (where deck meets house) for water damage. This is the #1 failure point.', category: 'Exterior', priority: 'high', estTimeMin: 30 },
    { id: 'jul-05', title: 'Check for wasp, hornet & mud dauber nests', description: 'Check under eaves, in grill covers, around deck posts, and in playset corners. Knock down small nests early with a long-reach spray.', category: 'Exterior', priority: 'medium', estTimeMin: 30 },
    { id: 'jul-06', title: 'Replace AC filter', description: 'Mid-cooling-season swap. Dirty filters ice up the evaporator coil.', category: 'HVAC', priority: 'medium', estTimeMin: 10 },
    { id: 'jul-07', title: 'Clean window wells & verify covers', description: 'Leaves and seeds accumulate in basement window wells and block the drain. A clogged well floods into the basement during a thunderstorm.', category: 'Exterior', priority: 'medium', estTimeMin: 30 }
  ],
  8: [ // August
    { id: 'aug-01', title: 'Core aerate lawn (MN/WI prime window starts mid-August)', description: 'Per MN Extension: aeration runs mid-August through mid-October. Cooler nights + fall rain = fast recovery. Rent a core aerator or hire a lawn service.', category: 'Lawn', priority: 'high', estTimeMin: 180 },
    { id: 'aug-02', title: 'Overseed thin or bare areas (best seeding starts Aug)', description: 'Per MN Extension: early August through mid-September is the BEST window for seeding cool-season grasses. Cooler nights, warm soil, less weed competition than spring.', category: 'Lawn', priority: 'high', estTimeMin: 120 },
    { id: 'aug-03', title: 'Dethatch if thatch layer >1/2"', description: 'Per MN Extension: dethatching is ok mid-Aug through mid-Oct. Push a screwdriver into the lawn — if the thatch/soil layer feels spongy over 1/2", dethatch.', category: 'Lawn', priority: 'medium', estTimeMin: 180 },
    { id: 'aug-04', title: 'Prune dead branches from trees', description: 'Easier to spot in full leaf. Remove anything dead, dying, diseased, or rubbing on another limb. Anything bigger than 2" diameter — call an arborist.', category: 'Lawn', priority: 'medium', estTimeMin: 60 },
    { id: 'aug-05', title: 'Clean dryer vent again', description: 'Midyear check — especially if you do a lot of laundry or have pets.', category: 'Appliance', priority: 'medium', estTimeMin: 30 },
    { id: 'aug-06', title: 'Inspect attic insulation & ventilation', description: 'Hot August attics reveal ventilation problems. Soffit vents should be unobstructed; ridge or gable vents should be clear.', category: 'Interior', priority: 'low', estTimeMin: 30 }
  ],
  9: [ // September
    { id: 'sep-01', title: 'Fall fertilization (key Midwest feeding)', description: 'Per MN Extension: fertilization runs mid-August through mid-October. The fall feeding is arguably the most important — grass stores energy for winter and greens up faster next spring.', category: 'Lawn', priority: 'high', estTimeMin: 45 },
    { id: 'sep-02', title: 'Broadleaf weed control (best window starts now)', description: 'Per MN Extension: broadleaf weed control runs late-September through late-October. Fall-applied herbicide translocates to roots as weeds prep for dormancy — kills dandelion & creeping charlie better than spring treatment.', category: 'Lawn', priority: 'high', estTimeMin: 60 },
    { id: 'sep-03', title: 'Schedule furnace tune-up', description: 'Book before the first cold snap. Techs get booked out 2-3 weeks by mid-October.', category: 'HVAC', priority: 'high', estTimeMin: 15 },
    { id: 'sep-04', title: 'Clean gutters (first round after leaf drop starts)', description: 'Maples and ashes drop earliest. A mid-fall + late-fall gutter cleaning is better than one messy single pass.', category: 'Roof', priority: 'medium', estTimeMin: 90 },
    { id: 'sep-05', title: 'Chimney & fireplace inspection', description: 'Have a certified sweep (CSIA) inspect and clean before the first fire. Creosote buildup is the leading cause of chimney fires.', category: 'Safety', priority: 'high', estTimeMin: 90 },
    { id: 'sep-06', title: 'Test smoke & CO detectors', description: 'Biannual check — do this every time daylight saving time shifts.', category: 'Safety', priority: 'high', estTimeMin: 20 },
    { id: 'sep-07', title: 'Plant fall bulbs (tulip, daffodil, crocus)', description: 'Get bulbs in the ground 6 weeks before hard freeze. Plant at 3x the bulb\'s height.', category: 'Lawn', priority: 'low', estTimeMin: 60 },
    { id: 'sep-08', title: 'Replace furnace filter', description: 'Fresh filter for the start of heating season.', category: 'HVAC', priority: 'high', estTimeMin: 10 }
  ],
  10: [ // October
    { id: 'oct-01', title: 'Winterize sprinkler system (blowout)', description: 'Before the first hard freeze (typically mid-to-late October in the Upper Midwest). Use compressed air to blow out each zone — skipping this cracks backflow preventers and valves.', category: 'Lawn', priority: 'high', estTimeMin: 90 },
    { id: 'oct-02', title: 'Disconnect & drain garden hoses', description: 'A hose left attached traps water in the sillcock — even "frost-free" ones fail when there\'s a hose on them. Drain, coil, and store indoors.', category: 'Plumbing', priority: 'high', estTimeMin: 20 },
    { id: 'oct-03', title: 'Final mow — drop height to 2-2.5"', description: 'Shorter grass at winter reduces snow mold. Do a last mulch of leaves at the same time to feed the lawn.', category: 'Lawn', priority: 'medium', estTimeMin: 90 },
    { id: 'oct-04', title: 'Rake/mulch leaves', description: 'A mulching mower can handle a surprising amount. Heavy piles on the lawn smother grass and invite voles.', category: 'Lawn', priority: 'medium', estTimeMin: 180 },
    { id: 'oct-05', title: 'Clean gutters after leaves fall', description: 'The more important of the two fall cleanings. Check downspout extensions are back in place.', category: 'Roof', priority: 'high', estTimeMin: 90 },
    { id: 'oct-06', title: 'Winterize outdoor faucets & insulate exposed pipes', description: 'Shut off interior valves to hose bibs and drain the outside line. Insulate any pipes in crawlspaces, garages, or unheated basements with foam sleeves.', category: 'Plumbing', priority: 'high', estTimeMin: 45 },
    { id: 'oct-07', title: 'Store outdoor furniture & grill cover', description: 'Clean cushions, stack chairs, and move to garage or shed. Cover the grill (but disconnect propane first).', category: 'Exterior', priority: 'low', estTimeMin: 60 },
    { id: 'oct-08', title: 'Check weatherstripping & caulk gaps', description: 'Run a hand around doors and windows on a windy day. Re-caulk exterior gaps and replace worn door sweeps before the cold settles in.', category: 'Exterior', priority: 'medium', estTimeMin: 90 }
  ],
  11: [ // November
    { id: 'nov-01', title: 'Service snowblower (fresh gas, spark plug, oil)', description: 'Run old fuel out or add stabilizer. Replace spark plug, check auger shear pins, and top off oil. Test-run it in the driveway — don\'t discover it won\'t start during the first 8" storm.', category: 'Garage', priority: 'high', estTimeMin: 60 },
    { id: 'nov-02', title: 'Stock ice melt, shovels, and sand', description: 'Hardware stores sell out after the first storm. Keep a bag of calcium chloride (works to -25°F) for cold snaps when rock salt fails.', category: 'Seasonal', priority: 'medium', estTimeMin: 30 },
    { id: 'nov-03', title: 'Reverse ceiling fans to clockwise (on low)', description: 'Winter setting pushes warm air down from the ceiling. Low speed avoids creating a draft.', category: 'Interior', priority: 'low', estTimeMin: 15 },
    { id: 'nov-04', title: 'Replace furnace filter', description: 'Fresh filter for peak heating season.', category: 'HVAC', priority: 'high', estTimeMin: 10 },
    { id: 'nov-05', title: 'Check attic hatch weatherstripping', description: 'A leaky attic hatch is a huge energy drain. Foam weatherstrip + a rigid foam cover on top of the hatch makes a big difference.', category: 'Interior', priority: 'medium', estTimeMin: 30 },
    { id: 'nov-06', title: 'Clean humidifier & start winter setting', description: 'Install fresh wick/pad on whole-house humidifiers and open the damper to the winter setting. Target 30-40% indoor humidity.', category: 'HVAC', priority: 'medium', estTimeMin: 30 },
    { id: 'nov-07', title: 'Clean & store lawn tools', description: 'Wipe metal parts with an oily rag, drain gas from mower (or add stabilizer), sharpen/replace mower blade for spring.', category: 'Garage', priority: 'low', estTimeMin: 90 },
    { id: 'nov-08', title: 'Final leaf cleanup & gutter check', description: 'One more pass for late-dropping oak leaves. Make sure downspouts are clear before snow freezes.', category: 'Roof', priority: 'medium', estTimeMin: 90 }
  ],
  12: [ // December
    { id: 'dec-01', title: 'Check furnace filter', description: 'Holiday cooking + candles + more people in the house = dirtier filter. Check monthly in peak heating season.', category: 'HVAC', priority: 'medium', estTimeMin: 10 },
    { id: 'dec-02', title: 'Test holiday lights before hanging', description: 'Plug in each strand before climbing the ladder. Replace any with cracked insulation or bent prongs. Use outdoor-rated GFCI outlets only.', category: 'Safety', priority: 'medium', estTimeMin: 30 },
    { id: 'dec-03', title: 'Monitor ice dams & attic temperatures', description: 'After every 6"+ snowfall, look at the eaves. Long icicles or heavy ice at the gutter = ice dam forming. A roof rake (pulled from the ground) is safer than climbing.', category: 'Roof', priority: 'high', estTimeMin: 15 },
    { id: 'dec-04', title: 'Shovel/blow snow away from foundation', description: 'Piled-up snow melts against the foundation and refreezes in cracks. Keep a 3-foot buffer cleared.', category: 'Seasonal', priority: 'medium', estTimeMin: 30 },
    { id: 'dec-05', title: 'Check smoke & CO detectors (holiday cooking season)', description: 'Highest home fire risk of the year is Thanksgiving and Christmas. Make sure batteries are fresh and detectors aren\'t past their 10-year expiration.', category: 'Safety', priority: 'high', estTimeMin: 20 },
    { id: 'dec-06', title: 'Keep gutters clear of ice buildup', description: 'If downspouts freeze solid, meltwater backs up under shingles. Heated gutter cables are worth considering on north-facing roof slopes.', category: 'Roof', priority: 'medium', estTimeMin: 20 },
    { id: 'dec-07', title: 'Drain a few gallons from water heater tank', description: 'Annual mini-flush removes sediment that accumulates at the bottom. Extends tank life and improves recovery time.', category: 'Plumbing', priority: 'low', estTimeMin: 20 },
    { id: 'dec-08', title: 'Review & update home inventory / insurance', description: 'Good end-of-year task. Walk through with a phone camera and record each room. Store video in cloud for insurance claims.', category: 'Safety', priority: 'low', estTimeMin: 45 }
  ]
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const CATEGORIES = [
  'Lawn', 'HVAC', 'Plumbing', 'Roof', 'Safety',
  'Exterior', 'Interior', 'Appliance', 'Garage', 'Seasonal'
];

const CATEGORY_COLORS = {
  Lawn:      '#16a34a',
  HVAC:      '#ea580c',
  Plumbing:  '#0891b2',
  Roof:      '#7c3aed',
  Safety:    '#dc2626',
  Exterior:  '#ca8a04',
  Interior:  '#6366f1',
  Appliance: '#0284c7',
  Garage:    '#64748b',
  Seasonal:  '#db2777'
};
