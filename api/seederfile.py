import os
from typing import Any

from psycopg_pool import ConnectionPool

database_url = os.environ.get("DATABASE_URL")
if database_url is None:
    raise RuntimeError("DATABASE_URL environment variable is not set")

pool = ConnectionPool(conninfo=database_url)

icons = [
    ("A", "https://i.redd.it/dpbwgm93b4921.gif"),
    ("B", "https://awesomefriday.ca/wp-content/uploads/2013/12/tumblr_m9sz3aJaEy1qb8idyo1_500.gif"),
    ("C", "https://i.pinimg.com/originals/91/05/3a/91053ac18b8b3368d29a1409ad6be5f1.gif"),
    ("D", "https://giffiles.alphacoders.com/164/164315.gif"),
    ("E", "https://i.pinimg.com/originals/eb/a8/9e/eba89e7bb2121d9f066fbc7d616a0dc0.gif"),
    ("F", "https://i.redd.it/r778gpaze03d1.gif"),
    ("G", "https://forums.terraria.org/index.php?attachments/tenguman-gif.252393/"),
    ("H", "https://preview.redd.it/tib8dqapwv271.gif?width=256&auto=webp&s=7e16d45f329ef9b28614da50101672a8133ddbfb"),
    ("I", "https://preview.redd.it/v92xo3jq15t61.gif?width=256&auto=webp&s=3659ba294d2ee2f922f6a2e1b5c68dbce1568386"),
]

games: list[dict[str, Any]] = [
    {
        "name": "Stellaris",
        "description": "<p>Featuring deep strategic gameplay, a rich and enormously diverse selection of alien races and emergent storytelling, Stellaris has engaging challenging gameplay that rewards interstellar exploration as you traverse, discover, interact and learn more about the multitude "
        "of "
        "species you will encounter during your travels.<br />Etch your name across the cosmos by forging a galactic empire; colonizing remote planets and integrating alien civilizations. Will you expand through war alone or walk the path of diplomacy to achieve your goals? Main FeaturesDeep &amp; "
        "Varied Exploration.<br />Enormous procedural galaxies, containing thousands of planets.<br />Explore Anomalies with your heroic Scientist leaders.<br />Infinitely varied races through customization and procedural generation.<br />Advanced Diplomacy system worthy of a Grand Strategy Game."
        "<br />Ship Designer based on a vast array of technologies.<br />Stunning space visuals.</p>",
        "rating": 4.12,
        "dates": "2016-05-08",
        "background_img": "https://media.rawg.io/media/games/92b/92bbf8a451e2742ab812a580546e593a.jpg",
        "platforms": {"PC": True},
        "rating_count": 100,
        "rating_total": 412.0,
        "genre": "Strategy",
        "developers": "Paradox Development Studio",
        "rawg_pk": "10040",
        "reviews_count": 0,
    },
    {
        "name": "Dying Light",
        "description": "<p>Dying Light is a first-person action horror game with the elements of survival. It is a first part of the Dying light series followed by Dying Light 2. The game is set in the open-world environment of fictional Harran city. Players are offered to assume the role of an "
        'undercover agent Kyle Crane who has been sent in the quarantine zone. His mission is to find the rogue politician Kadir "Rais" Suleiman lost somewhere in the infected giant city. On the way to achieving the goal, Kyle will meet other survivors, who desperately try to stay alive among '
        "zombies. The chief game mechanic is running the generators and turning on streetlights throughout Harran to make another part of the map accessible and safe at nighttime. The game features day/night time cycles that change the game remarkably: the action becomes fast-paced, and all the "
        "infected people turn into dangerous zombies. Therefore, the gameplay is based on armed combat against mutants and Kyle's sneak and parkour skill for preventing it.</p>",
        "rating": 4.09,
        "dates": "2015-01-27",
        "background_img": "https://media.rawg.io/media/games/4a5/4a5ce21f529cf8fd4670b4c3188b25df.jpg",
        "platforms": {"PC": True, "Xbox": True, "PlayStation": True, "Nintendo": True},
        "rating_count": 100,
        "rating_total": 409.0,
        "genre": "Adventure",
        "developers": "Techland",
        "rawg_pk": "42215",
        "reviews_count": 0,
    },
    {
        "name": "Civilization IV: Warlords",
        "description": "<p>Civilization IV: Warlords is the first official expansion pack for well-known video game Civilization IV. The game adds new features into original game such as a new category called Great Generals which can join a city as a Great Military Instructor, which gives +2 "
        "experience points to any military unit created in the city or creates a Military Academy, which boosts military unit production by 50%. Also, the game offers the ability to institute vassal states, which lets player to take up other empires as vassals. When an empire becomes a vassal, it "
        "loses the ability to declare war and make peace independently.<br />Warlords offers new civilizations including Carthage, the Celts, Korea, the Ottoman Empire, the Vikings and the Zulu, and four new leaders for existing civilizations.<br />There are also eight new scenarios, six new "
        "civilizations which can be played in single-player as well as in multiplayer mode, ten new leaders, three new leader traits, unique buildings for each civilization, three new wonders, new units, resources and improvements, core gameplay tweaks and additions and inclusion of all patches "
        "released for original game.</p>",
        "rating": 3.7,
        "dates": "2006-07-26",
        "background_img": "https://media.rawg.io/media/screenshots/4f2/4f24c59ac7ba91590d7394acac0bfae8.jpg",
        "platforms": {"PC": True},
        "rating_count": 100,
        "rating_total": 370.0,
        "genre": "Strategy",
        "developers": "Firaxis",
        "rawg_pk": "13779",
        "reviews_count": 0,
    },
    {
        "name": "Hearts of Iron 2 Complete",
        "description": "<p>Includes Hearts of Iron II plus the two expansions, Doomsday and Armageddon</p><p>When Germany is defeated in 1945, the Allies and the new Soviet alliance fight for supremacy. World War III is drawing closer.</p><p>Play as the ruler of one of 175 countries through World "
        "Wars II and III. As the Allies and the Soviet Union clash in Europe, the fate of the world hangs in the balance.</p><ul><li>Detailed diplomacy and production systems with help functions to avoid micromanagement.</li><li>Movement-is-attack combat system making warfare more realistic.</li>"
        "<li>Mission-based Air and Naval system, giving options for logistical strikes and targeted bombing.</li><li>New political system with possibilities to change the political base of your country during the war.</li><li>Fifteen battle scenarios optimized for an evening or two for gaming. "
        "Historical scenarios like Case White, Operation Barbarossa and alternative history scenarios like Operation Watchtower and Case Green are included in the game.</li><li>Co-operative multiplayer, enabling players to share the same country while playing.</li></ul><p>Doomsday Expansion "
        "Features</p><ul><li>World War III scenario with an alternative historical outcome. Play the Soviet alliance, the United States or any country of your choice as new superpowers rise to power on the global stage.</li><li>Expanded tech trees with considerable detail in a new decade of "
        "warfare,"
        " allowing you to develop tactical nukes and other kinds of nuclear warfare as well as helicopter squads, Escort carriers and much more.</li><li>Improved Diplomatic/Intelligence System reflects the increased political tension of the 1950s.</li></ul><p>Armageddon Expansion Features</p><ul>"
        "<li>New attachments for Naval units; do you scrap or upgrade those old ships.</li><li>Land units can now be built with brigades already attached.</li><li>An Air Naval combat system that radically alters the combat balance.</li><li>New damage algorithms for the Air combat system, making "
        "organization more important and allowing air units to fight longer.</li></ul>",
        "rating": 3.35,
        "dates": "2009-01-23",
        "background_img": "https://media.rawg.io/media/screenshots/07d/07dad72dd41319d2ea2752b0b4155626.jpeg",
        "platforms": {"PC": True},
        "rating_count": 100,
        "rating_total": 335.0,
        "genre": "Strategy",
        "developers": "Paradox Development Studio",
        "rawg_pk": "19241",
        "reviews_count": 0,
    },
    {
        "name": "Age of Empires IV",
        "description": "<p>One of the most beloved real-time strategy games returns to glory with Age of Empires IV, putting you at the center of epic historical battles that shaped the world. Featuring both familiar and innovative new ways to expand your empire in vast landscapes with stunning 4K "
        "visual fidelity, Age of Empires IV brings an evolved real-time strategy game to a new generation.</p><p>Return to History - The past is prologue as you are immersed in a rich historical setting of 8 diverse civilizations across the world from the English to the Chinese to the Delhi "
        "Sultanate in your quest for victory. Build cities, manage resources, and lead your troops to battle on land and at sea in 4 distinct campaigns with 35 missions that span across 500 years of history from the Dark Ages up to the Renaissance.</p><p>Choose Your Path to Greatness with "
        "Historical"
        " Figures - Live the adventures of Joan of Arc in her quest to defeat the English, or command mighty Mongol troops as Genghis Khan in his conquest across Asia. The choice is yours - and every decision you make will determine the outcome of history.</p><p>Customize Your Game with Mods - "
        "Available in Early 2022, play how you want with user generated content tools for custom games.</p><p>Challenge the World - Jump online to compete, cooperate or spectate with up to 7 of your friends in PVP and PVE multiplayer modes.</p><p>An Age for All Players - Age of Empires IV is an "
        "inviting experience for new players with a tutorial system that teaches the essence of real-time strategy and a Campaign Story Mode designed for first time players to help achieve easy setup and success, yet is challenging enough for veteran players with new game mechanics, evolved "
        "strategies, and combat techniques.</p>",
        "rating": 3.89,
        "dates": "2021-10-28",
        "background_img": "https://media.rawg.io/media/games/23e/23e45acbf29bd241913ddcf5cf4053d5.jpg",
        "platforms": {"PC": True},
        "rating_count": 100,
        "rating_total": 389.0,
        "genre": "Strategy",
        "developers": "Relic Entertainment",
        "rawg_pk": "58618",
        "reviews_count": 0,
    },
    {
        "name": "Scythe: Digital Edition",
        "description": "<p>Scythe is a board game set in an alternate-history 1920s period. It is a time of farming and war, broken hearts and rusted gears, innovation and valor. In Scythe, each player represents a fallen leader attempting to restore their honor and lead their faction to power in "
        "Eastern Europa. Players conquer territory, enlist new recruits, reap resources, gain villagers, build structures, and activate monstrous mechs.<br />Features :<br />-Asymmetry: Each player begins the game with different resources (strength, victory points, movement capabilities, and "
        "popularity), their choice of several faction-specific abilities, and a hidden goal. Starting positions are specially calibrated to contribute to each faction's uniqueness and the asymmetrical nature of the game.<br />-Strategy: Scythe gives players almost complete control over their fate. "
        "Other than each player's individual hidden objective cards, the only elements of luck are encounter cards that players will draw as they interact with the citizens of newly explored lands and combat cards that give you a temporary boost in combat. Combat is also driven by choices, not "
        "luck "
        "or randomness.<br />-Engaged Play: Scythe uses a streamlined action-selection mechanism (no rounds or phases) to keep gameplay moving at a brisk pace and reduce downtime between turns. While there is plenty of direct conflict, there is no player elimination, nor can units be killed or "
        "destroyed.<br />Engine Building: Players can upgrade actions to become more efficient, build structures that improve their position on the map, enlist new recruits to enhance character abilities, activate mechs to deter opponents from invading, and expand their borders to reap greater "
        "types"
        " and quantities of resources. These engine-building aspects create a sense of momentum and progress throughout the game. The order in which players improve their engine adds to the unique feel of each game, even when playing one faction multiple times.</p>",
        "rating": 3.46,
        "dates": "2018-09-05",
        "background_img": "https://media.rawg.io/media/games/eed/eed5c04763919193268a78351d33ec19.jpg",
        "platforms": {"PC": True},
        "rating_count": 100,
        "rating_total": 346.0,
        "genre": "Strategy",
        "developers": "Asmodee Digital",
        "rawg_pk": "51350",
        "reviews_count": 0,
    },
    {
        "name": "Gran Turismo 7",
        "description": "<p>Gran Turismo™ 7 builds on 22 years of experience to bring you the best features from the history of the franchise</p><p>Whether you're a competitive racer, collector, fine-tuning builder, livery designer, photographer or arcade fan - ignite your personal passion for cars"
        "with features inspired by the past, present and future of Gran Turismo™."
        "</p>",
        "rating": 4.29,
        "dates": "2022-03-04",
        "background_img": "https://media.rawg.io/media/games/3f6/3f6a04b856f23310d3c2f5be8c5963f7.jpg",
        "platforms": {"PlayStation": True},
        "rating_count": 100,
        "rating_total": 429.0,
        "genre": "Action",
        "developers": "Polyphony Digital",
        "rawg_pk": "452633",
        "reviews_count": 0,
    },
    {
        "name": "Elden Ring",
        "description": "<p>The Golden Order has been broken.</p><p>Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.</p><p>In the Lands Between ruled by Queen Marika the Eternal, the Elden Ring, the source of the Erdtree, "
        "has been shattered.</p><p>Marika's offspring, demigods all, claimed the shards of the Elden Ring known as the Great Runes, and the mad taint of their newfound strength triggered a war: The Shattering. A war that meant abandonment by the Greater Will.</p><p>And now the guidance of grace "
        "will"
        " be brought to the Tarnished who were spurned by the grace of gold and exiled from the Lands Between. Ye dead who yet live, your grace long lost, follow the path to the Lands Between beyond the foggy sea to stand before the Elden Ring.</p>",
        "rating": 4.42,
        "dates": "2022-02-25",
        "background_img": "https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7bab370a552855.jpg",
        "platforms": {"PC": True, "Xbox": True, "PlayStation": True},
        "rating_count": 100,
        "rating_total": 442.0,
        "genre": "Adventure",
        "developers": "FromSoftware",
        "rawg_pk": "326243",
        "reviews_count": 0,
    },
    {
        "name": "Super Smash Bros. Ultimate",
        "description": "<p>Super Smash Bros. Ultimate is the fifth game in its franchise. It is also the first game in its series to be released for Nintendo Switch.</p><h3>Premise</h3><p>The series is a crossover of characters from various video game franchises, such as The Legend of Zelda, "
        'Pokemon, Sonic the Hedgehog, Super Mario, Metroid, and Mega Man, among many others. Their famous protagonists fight each other on an arena. In accordance with its name, the game is the "ultimate" installment of the series, in that it offers the players all the characters ever featured '
        "in "
        "Super Smash Bros. The game also introduces five new characters, most famously, Castlevania's Simon Belmont.</p><h3>Gameplay</h3><p>Unlike most fighting games, Super Smash Bros. series is built around knocking opponents out of the arena rather than lowering their health bars. "
        "However, the damage meter increases the character's chances to be knocked out. Each fighter has a limited number of lives and loses one when he or she is knocked out. The player is eliminated when he or she loses all lives.</p><h3>Multiplayer</h3><p>Super Smash Bros. Ultimate includes "
        "several competitive multiplayer modes. Besides the traditional versus mode, there are several new modes not featured in the previous games. These include Tournament (the playoff mode for 32 players), Smash Squad (team multiplayer), Smashdown (a mode in which the defeated characters are "
        "eliminated).</p>",
        "rating": 4.37,
        "dates": "2018-12-07",
        "background_img": "https://media.rawg.io/media/games/9f3/9f3c513b301d8d7250a64dd7e73c62df.jpg",
        "platforms": {"Nintendo": True},
        "rating_count": 100,
        "rating_total": 437.0,
        "genre": "Action",
        "developers": "Nintendo",
        "rawg_pk": "58829",
        "reviews_count": 0,
    },
    {
        "name": "DRAGON QUEST XI: Echoes of an Elusive Age",
        "description": "<p>DRAGON QUEST® XI: Echoes of an Elusive Age™ follows the journey of a hunted Hero who must uncover the mystery of his fate with the aid of a charismatic cast of supporting characters. They embark on a quest taking them across continents and over vast oceans as they learn "
        "of an ominous threat facing the world.<br />DQ XI brings a massive, gorgeous world to life in a style that blends stylistic cel-shading with photorealistic detail.<br />Engage in a turn-based battle system that eases players into combat, featuring mechanics simple enough for novices but "
        "with enough depth to satisfy long-time fans.<br />DQ XI features tons of side-quests and mini-games, providing enough content to keep you playing for well over 100 hours.<br />Software subject to license (us.playstation.com/softwarelicense). Online features require an account and are "
        "subject to terms of service and applicable privacy policy (playstationnetwork.com/terms-of-service &amp; playstationnetwork.com/privacy-policy). One-time license fee for play on account's designated primary PS4™ system and other PS4™ systems when signed in with that account.<br />DRAGON "
        "QUEST, ECHOES OF AN ELUSIVE AGE, SQUARE ENIX and the SQUARE ENIX logo are trademarks or registered trademarks of Square Enix Holdings Co., Ltd.</p>",
        "rating": 4.31,
        "dates": "2017-07-29",
        "background_img": "https://media.rawg.io/media/games/e04/e041cc430f6b6681477580d3bcddf29f.jpg",
        "platforms": {"PC": True, "Xbox": True, "PlayStation": True, "Nintendo": True},
        "rating_count": 100,
        "rating_total": 431.0,
        "genre": "RPG",
        "developers": "Square Enix",
        "rawg_pk": "58084",
        "reviews_count": 0,
    },
    {
        "name": "The Witcher 3: Wild Hunt",
        "description": "<p>The third game in a series, it holds nothing back from the player. Open world adventures of the renowned monster slayer Geralt of Rivia are now even on a larger scale. Following the source material more accurately, this time Geralt is trying to find the child of the "
        "prophecy, Ciri while making a quick coin from various contracts on the side. Great attention to the world building above all creates an immersive story, where your decisions will shape the world around you.</p><p>CD Project Red are infamous for the amount of work they put into their "
        "games, and it shows, because aside from classic third-person action RPG base game they provided 2 massive DLCs with unique questlines and 16 smaller DLCs, containing extra quests and items.</p><p>Players praise the game for its atmosphere and a wide open world that finds the balance "
        "between fantasy elements and realistic and believable mechanics, and the game deserved numerous awards for every aspect of the game, from music to direction.</p>",
        "rating": 4.65,
        "dates": "2015-05-18",
        "background_img": "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
        "platforms": {"PC": True, "Xbox": True, "PlayStation": True, "Nintendo": True},
        "rating_count": 100,
        "rating_total": 465.0,
        "genre": "Adventure",
        "developers": "CD PROJEKT RED",
        "rawg_pk": "3328",
        "reviews_count": 0,
    },
    {
        "name": "The Elder Scrolls V: Skyrim",
        "description": "<p>The fifth game in the series, Skyrim takes us on a journey through the coldest region of Cyrodiil. Once again player can traverse the open world RPG armed with various medieval weapons and magic, to become a hero of Nordic legends -Dovahkiin, the Dragonborn. After "
        "mandatory character creation players will have to escape not only imprisonment but a fire-breathing dragon. Something Skyrim hasn't seen in centuries.</p>",
        "rating": 4.42,
        "dates": "2011-11-11",
        "background_img": "https://media.rawg.io/media/games/7cf/7cfc9220b401b7a300e409e539c9afd5.jpg",
        "platforms": {"PC": True, "Xbox": True, "PlayStation": True, "Nintendo": True},
        "rating_count": 100,
        "rating_total": 442.0,
        "genre": "RPG",
        "developers": "Bethesda Softworks",
        "rawg_pk": "5679",
        "reviews_count": 0,
    },
    {
        "name": "Divinity: Original Sin 2",
        "description": "<p>The Divine is dead. The Void approaches. And the powers latent within you are soon to awaken. The battle for Divinity has begun. Choose wisely and trust sparingly; darkness lurks within every heart.</p><p>Who will you be? A flesh-eating elf; an imperial lizard; an undead "
        "risen from the grave? Choose your race and origin story - or create your own! Discover how the world reacts differently to who - and what - you are.It's time for a new Divinity!<br />Gather your party and develop relationships with your companions. Blast your opponents in deep tactical "
        "turn-based combat. Use the environment as a weapon, use height to your advantage, and manipulate the elements.Ascend as the god that Rivellon so desperately needs.<br />Explore the vast and layered world of Rivellon alone or with up to 4 players in drop-in/drop-out co-operative play. Go "
        "anywhere, kill anyone, and explore endless ways to interact with the world. Continue to play in the brand-new PvP and Game Master modes.<br />Choose your race and origin. or create your own as a Human, Lizard, Elf, Dwarf, or Undead. The world reacts to who you are, and what you've done. "
        "Every choice will have a consequence.<br />Unlimited freedom to explore and experiment. Go anywhere, talk to anyone, and interact with everything! Every NPC can be killed, and every animal spoken to! Even ghosts hold a few secrets or two…<br />The next generation of turn-based combat. "
        "Revamped action point system, AI 2.0., new elemental combos, over 200 skills, height advantage… and much, much more.<br />Up to 4 player online and split-screen multiplayer. Choose one of the 6 pre-made characters or create your own. Play with your friends online or in local split-screen "
        "with full controller support.<br />Game Master Mode: Take your imagination to the next level and craft your own stories with the Game Master mode. Download fan-made campaigns and mods from Steam Workshop.</p>",
        "rating": 4.4,
        "dates": "2017-09-14",
        "background_img": "https://media.rawg.io/media/games/424/424facd40f4eb1f2794fe4b4bb28a277.jpg",
        "platforms": {"PC": True, "Xbox": True, "PlayStation": True, "Nintendo": True},
        "rating_count": 100,
        "rating_total": 440.0,
        "genre": "RPG",
        "developers": "Larian Studios",
        "rawg_pk": "10073",
        "reviews_count": 0,
    },
    {
        "name": "Kingdom Come: Deliverance",
        "description": "<p>You're Henry, the son of a blacksmith. Thrust into a raging civil war, you watch helplessly as invaders storm your village and slaughter your friends and family. Narrowly escaping the brutal attack, you grab your sword to fight back. Avenge the death of your parents and"
        "help repel the invading forces!</p>",
        "rating": 4.02,
        "dates": "2018-02-13",
        "background_img": "https://media.rawg.io/media/games/d8f/d8f3b28fc747ed6f92943cdd33fb91b5.jpeg",
        "platforms": {"PC": True, "Xbox": True, "PlayStation": True},
        "rating_count": 100,
        "rating_total": 402.0,
        "genre": "Action",
        "developers": "Deep Silver",
        "rawg_pk": "28172",
        "reviews_count": 0,
    },
    {
        "name": "Marvel's Spider-Man Remastered",
        "description": "<p>This isn't the Spider-Man you've met or ever seen before. In Marvel's Spider-Man Remastered, we meet an experienced Peter Parker who's more masterful at fighting big crime in New York City. At the same time, he's struggling to balance his chaotic personal life and career "
        "while the fate of Marvel's New York rests upon his shoulders.</p><p>Discover the complete web-slinging story with the Marvel's Spider-Man: Miles Morales Ultimate Edition. This unmissable bundle includes a voucher code** for Marvel's Spider-Man Remastered - the complete award-winning game, "
        "including all three DLC chapters in the Marvel's Spider-Man: The City That Never Sleeps adventure - remastered and enhanced for the PS5 console.</p>",
        "rating": 4.45,
        "dates": "2020-11-12",
        "background_img": "https://media.rawg.io/media/games/5f1/5f1399f755ed3a40b04a9195f4c06be5.jpg",
        "platforms": {"PC": True, "PlayStation": True},
        "rating_count": 100,
        "rating_total": 445.0,
        "genre": "Action",
        "developers": "Insomniac Games",
        "rawg_pk": "663742",
        "reviews_count": 0,
    },
    {
        "name": "Uncharted: Drake's Fortune",
        "description": "<p>The game that started the popular Uncharted series. It is all about a treasure hunt in the jungle and ancient ruins and thus somewhat similar in mood and aesthetics to the Tomb Raider series, albeit with a slightly more realistic approach.</p><p>The plot follows the "
        "adventurer and treasure seeker Nathan Drake, who believes himself to be a distant offspring of the famous Sir Francis Drake. When exhuming his ancestor's remains, Nathan discovers an artifact that supposedly shows him the way to the legendary El Dorado, the city of gold in the Latin "
        "American folklore. Accompanied by journalist Elena Fisher, he sets out on a dangerous journey to a remote island. Throughout the game Nathan, controlled by the player, will have to fight pirates, using both melee weapons and firearms, and explore ancient ruins by jumping the cliffs, "
        "climbing the walls and swinging from the ropes.</p><p>Uncharted: Drake's Fortune includes motion-captured cinematic cutscenes that help develop characters and the plot to the point the game may feel like a blockbuster movie.</p>",
        "rating": 4.03,
        "dates": "2007-11-19",
        "background_img": "https://media.rawg.io/media/games/f2e/f2e6dcf9c27d99ba2551f1094ad41756.jpg",
        "platforms": {"PlayStation": True},
        "rating_count": 100,
        "rating_total": 403.0,
        "genre": "Shooter",
        "developers": "Naughty Dog",
        "rawg_pk": "4340",
        "reviews_count": 0,
    },
    {
        "name": "God of War (2018)",
        "description": "<p>It is a new beginning for Kratos. Living as a man outside the shadow of the gods, he ventures into the brutal Norse wilds with his son Atreus, fighting to fulfill a deeply personal quest.</p><p>His vengeance against the Gods of Olympus years behind him, Kratos now lives "
        "as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive… And teach his son to do the same. This startling reimagining of God of War deconstructs the core elements that defined the series—satisfying combat; breathtaking scale; "
        "and a powerful narrative—and fuses them anew.</p><p>Kratos is a father again. As mentor and protector to Atreus, a son determined to earn his respect, he is forced to deal with and control the rage that has long defined him while out in a very dangerous world with his son.</p><p>From the "
        "marble and columns of ornate Olympus to the gritty forests, mountains, and caves of Pre-Viking Norse lore, this is a distinctly new realm with its own pantheon of creatures, monsters, and gods. With an added emphasis on discovery and exploration, the world will draw players in to explore "
        "every inch of God of War's breathtakingly threatening landscape—by far the largest in the franchise.</p><p>With an over the shoulder free camera that brings the player closer to the action than ever before, fights in God of War mirror the pantheon of Norse creatures Kratos will face: "
        "grand, gritty, and grueling. A new main weapon and new abilities retain the defining spirit of God of War while presenting a vision of violent conflict that forges new ground in the genre</p>",
        "rating": 4.57,
        "dates": "2018-04-20",
        "background_img": "https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg",
        "platforms": {"PC": True, "PlayStation": True},
        "rating_count": 100,
        "rating_total": 457.0,
        "genre": "Action",
        "developers": "SCE Santa Monica Studio",
        "rawg_pk": "58175",
        "reviews_count": 0,
    },
    {
        "name": "Destiny 2: Forsaken",
        "description": "<p>Following years of strife, what remains of the Reef has fallen to lawlessness. You and Cayde-6 are sent to personally investigate the recent unrest. Upon arrival, you soon discover the most-wanted criminals in the Prison of Elders have organized an escape. Beyond the "
        "Vanguard's authority, you'll pursue these fugitives deep into the Reef. Explore new regions, awaken new powers, earn powerful weapons, and uncover long lost Awoken secrets. The hunt is on.</p>",
        "rating": 4.13,
        "dates": "2018-09-04",
        "background_img": "https://media.rawg.io/media/games/68c/68c7bafb388dc19348bc694ae55919a5.jpg",
        "platforms": {"PC": True, "Xbox": True, "PlayStation": True},
        "rating_count": 100,
        "rating_total": 413.0,
        "genre": "Adventure",
        "developers": "Activision",
        "rawg_pk": "59233",
        "reviews_count": 0,
    },
    {
        "name": "Cyberpunk 2077: Phantom Liberty",
        "description": "<p>Phantom Liberty is a new spy-thriller adventure for Cyberpunk 2077. When the orbital shuttle of the President of the New United States of America is shot down over the deadliest district of Night City, there's only one person who can save her — you. Become V, a cyberpunk "
        "for hire, and dive deep into a tangled web of espionage and political intrigue, unraveling a story that connects the highest echelons of power with the brutal world of black-market mercenaries.</p><p>Infiltrate Dogtown, a city-within-a-city run by a trigger-happy militia and ruled by a "
        "leader with an iron fist. With the help of NUSA sleeper agent Solomon Reed (Idris Elba) and the support of Johnny Silverhand (Keanu Reeves), unravel a web of shattered loyalties and use your every skill to survive in a fractured world of desperate hustlers, shadowy netrunners, and "
        "ruthless "
        "mercenaries. Built with the power of next-gen hardware in mind, Phantom Liberty offers brand-new gameplay mechanics, nail-biting courier jobs, gigs, and missions — and a thrilling main quest where freedom and loyalty always come at a price.</p>",
        "rating": 4.7,
        "dates": "2023-09-26",
        "background_img": "https://media.rawg.io/media/games/062/06285b425e61623530c5430f20e5d222.jpg",
        "platforms": {"PC": True, "Xbox": True, "PlayStation": True},
        "rating_count": 100,
        "rating_total": 470.0,
        "genre": "Shooter",
        "developers": "CD PROJEKT RED",
        "rawg_pk": "846303",
        "reviews_count": 0,
    },
    {
        "name": "Fallout: New Vegas",
        "description": "<p>Fallout: New Vegas is the second instalment after the reboot of the Fallout series and a fourth instalment in the franchise itself. Being a spin-off and developed by a different studio, Obsidian Entertainment, Fallout: New Vegas follows the Courier as he's ambushed by a "
        "gang lead by Benny, stealing a Platinum Chip and heavily wounded, practically left for dead. As he wakes up, he minds himself in the company of Doc Mitchell who saved our protagonist and patches him up. This section of the game is given for customising your characters, picking traits and "
        "the look of the main hero before embarking on his journey to retrieve Platinum Chip.</p><p>New Vegas has very similar gameplay to Fallout 3 with a few improvements, such as iron sights for most of the guns, new animations for VATS kills, new perk Survivor, which allowed you to have more "
        "benefits from drinks and food you could craft and gambling in the casinos. Expanded crafting system, weapon modification system force player to scavenge for resources. Reputation system was reintroduced in New Vegas as old reputation system from Fallout 2, with Karma making a serious "
        "impact"
        " on the game.</p>",
        "rating": 4.44,
        "dates": "2010-10-19",
        "background_img": "https://media.rawg.io/media/games/995/9951d9d55323d08967640f7b9ab3e342.jpg",
        "platforms": {"PC": True, "Xbox": True, "PlayStation": True},
        "rating_count": 100,
        "rating_total": 444.0,
        "genre": "Shooter",
        "developers": "Obsidian Entertainment",
        "rawg_pk": "5563",
        "reviews_count": 0,
    },
    {
        "name": "The Last of Us Part II",
        "description": "<p>The Last of Us Part II is the sequel to the post-apocalyptic zombie game The Last of Us.</p><p>Plot</p><p>The game follows Ellie, the girl who was the secondary protagonist and the player character's companion in The Last of Us. The game is set five years after the "
        "ending "
        "of the original. Both Ellie (who is by 19 now) and Joel survived and live in Jackson, Wyoming, where Ellie is dating another girl, Dina. However, the characters have to deal with the evil cult called the Seraphites, who try to sacrifice their former members. A matter of revenge forces "
        "Ellie"
        " and her friends to undertake a trip to Seattle, Washington, to kill their enemies. The major theme of the plot is Ellie's dealing with her hate issues.</p><p>Gameplay</p><p>Unlike in the original game, the player controls Ellie instead of Joel, who now becomes her AI-controlled "
        "companion. "
        "The game features improved controls that include new options such as crawling, dodging, and a jump button. A new AI system allows the human adversaries to communicate share information with each other. The game also introduces multiplayer.</p>",
        "rating": 4.42,
        "dates": "2020-06-19",
        "background_img": "https://media.rawg.io/media/games/909/909974d1c7863c2027241e265fe7011f.jpg",
        "platforms": {"PlayStation": True},
        "rating_count": 100,
        "rating_total": 442.0,
        "genre": "Action",
        "developers": "Naughty Dog",
        "rawg_pk": "51325",
        "reviews_count": 0,
    },
    {
        "name": "Final Fantasy VII",
        "description": "<p>The world is under the control of Shinra, a corporation controlling the planet's life force as mako energy. In the city of Midgar, Cloud Strife, former member of Shinra's elite SOLDIER unit now turned mercenary lends his aid to the Avalanche resistance group, unaware of "
        "the epic consequences that await him.</p><p>FINAL FANTASY VII REMAKE is a reimagining of the iconic original with unforgettable characters, a mind-blowing story, and epic battles.<br />The story of this first, standalone game in the FINAL FANTASY VII REMAKE project covers up to the "
        "party's escape from Midgar, and goes deeper into the events occurring in Midgar than the original FINAL FANTASY VII.</p>",
        "rating": 4.37,
        "dates": "2020-04-10",
        "background_img": "https://media.rawg.io/media/games/d89/d89bd0cf4fcdc10820892980cbba0f49.jpg",
        "platforms": {"PlayStation": True, "Nintendo": True},
        "rating_count": 100,
        "rating_total": 437.0,
        "genre": "RPG",
        "developers": "Square Enix",
        "rawg_pk": "259801",
        "reviews_count": 0,
    },
    {
        "name": "Stray",
        "description": "<p>Lost, alone and separated from family, a stray cat must untangle an ancient mystery to escape a long-forgotten city.</p><p>Stray is a third-person cat adventure game set amidst the detailed, neon-lit alleys of a decaying cybercity and the murky environments of its seedy "
        "underbelly. Roam surroundings high and low, defend against unforeseen threats and solve the mysteries of this unwelcoming place inhabited by curious droids and dangerous creatures.</p><p>See the world through the eyes of a cat and interact with the environment in playful ways. "
        "Be stealthy, nimble, silly, and sometimes as annoying as possible with the strange inhabitants of this mysterious world.</p><p>Along the way, the cat befriends a small flying drone, known only as B-12. With the help of this newfound companion, the duo must find a way out.</p><p>Stray is "
        "developed by BlueTwelve Studio, a small team from the south of France mostly made up of cats and a handful of humans.</p>",
        "rating": 4.15,
        "dates": "2022-07-19",
        "background_img": "https://media.rawg.io/media/games/cd3/cd3c9c7d3e95cb1608fd6250f1b90b7a.jpg",
        "platforms": {"PC": True, "PlayStation": True, "Nintendo": True},
        "rating_count": 100,
        "rating_total": 415.0,
        "genre": "Adventure",
        "developers": "BlueTwelve",
        "rawg_pk": "452638",
        "reviews_count": 0,
    },
    {
        "name": "Spyro Reignited Trilogy",
        "description": "<p>Spyro Reignited Trilogy is a collection that includes three remastered games from the Spyro franchise that were released in the late 1990s: Spyro the Dragon, Spyro 2: Ripto's Rage! and Spyro: Year of the Dragon</p><h3>Plot</h3><p>The plot of the game is identical to that "
        "of the three original games. They all follow Spyro, a small cutesy purple dragon, on his quest to save his dragon kin from various villains.</p><p>The games are set in the Dragon Kingdom, a fantasy world inhabited by sentient dragons. There are five dragon realms that used to co-exist "
        "peacefully. In the first game, the villain is Gnasty Gnorc (a gnome/orc half-blood), who magically turned all dragons into crystals. Spyro has to save them and defeat Gnorc. In the sequels, Spyro has to deal with other villains, such as Ripto the warlock, who tries to conquer the world, "
        "or Sorceress, who steals the dragons' eggs.</p><h3>Gameplay</h3><p>The player controls Spyro in a 3D environment from the third person view. Spyro can breathe fire to defeat his enemies. The dragon cannot actually fly, but he can glide long distances. A dragonfly companion named Sparx "
        "follows Spyro, helping him to pick up treasures and keep track of his health. To restore his health, Spyro can eat butterflies. The third game, Year of the Dragon, introduces other playable characters that can be unlocked by completing levels.</p>",
        "rating": 4.13,
        "dates": "2018-11-13",
        "background_img": "https://media.rawg.io/media/games/a50/a505bccdcfdc79970a93574c747f6e0d.jpg",
        "platforms": {"PC": True, "Xbox": True, "PlayStation": True, "Nintendo": True},
        "rating_count": 100,
        "rating_total": 413.0,
        "genre": "Action",
        "developers": "Activision",
        "rawg_pk": "58133",
        "reviews_count": 0,
    },
    {
        "name": "LittleBigPlanet 3",
        "description": "<p>LittleBigPlanet 3 is a side-scrolling platformer with a heavy focus on environmental puzzles. It's the final part of the LittleBigPlanet trilogy, where you, like in the previous installments, play as Sackboy, a knitted creature that can be customized with different "
        "costumes. There are three more characters additionally to him, and each of them has unique abilities that help to solve puzzles.<br /> In LittleBigPlanet 3 Sackboy is sent to another world called Bunkum where he needs to find three heroes and destroy the plans of Newton, the antagonist. "
        "To do so, he explores colorful levels, interacting with NPCs and solving puzzles. The game provides a huge variety of activities such as swimming, jumping, fighting enemies and interacting with the environment. There are also various collectibles in the game.  <br />LittleBigPlanet 3 pays "
        "great attention to its sandbox aspect, allowing the players to create their own levels, weapons, characters, and items. You can also share the things you created.</p>",
        "rating": 3.5,
        "dates": "2014-11-18",
        "background_img": "https://media.rawg.io/media/games/8e3/8e399167fd529da5e9e505e987ae63ff.jpg",
        "platforms": {"PlayStation": True},
        "rating_count": 100,
        "rating_total": 350.0,
        "genre": "Adventure",
        "developers": "Sumo Digital",
        "rawg_pk": "3501",
        "reviews_count": 0,
    },
    {
        "name": "Psychonauts 2",
        "description": "<p>Razputin Aquato, trained acrobat and powerful young psychic, has realized his life long dream of joining the international psychic espionage organization known as the Psychonauts! But these psychic super spies are in trouble. Their leader hasn't been the same since he was"
        "kidnapped, and what's worse, there's a mole hiding in headquarters. Raz must use his powers to stop the mole before they execute their secret plan--to bring the murderous psychic villain, Maligula, back from the dead!</p>",
        "rating": 4.37,
        "dates": "2021-08-24",
        "background_img": "https://media.rawg.io/media/games/c3c/c3c536cc4d32623ba928020dfd39a648.jpg",
        "platforms": {"PC": True, "PlayStation": True, "Nintendo": True},
        "rating_count": 100,
        "rating_total": 437.0,
        "genre": "Action",
        "developers": "Double Fine Productions",
        "rawg_pk": "257192",
        "reviews_count": 0,
    },
    {
        "name": "Call of Duty: Modern Warfare III",
        "description": "<p>ADAPT OR DIE IN A FIGHT AGAINST THE ULTIMATE THREAT</p><p>In the direct sequel to the record-breaking Call of Duty®: Modern Warfare® II, Captain Price and Task Force 141 face off against the ultimate threat. The ultranationalist war criminal Vladimir Makarov is extending "
        "his grasp across the world causing Task Force 141 to fight like never before.</p><p>IT'S TIME TO SETTLE OLD SCORES AND START NEW ONES</p><p>Modern Warfare® III celebrates the 20th anniversary of Call of Duty® with one of the greatest collections of Multiplayer maps ever assembled - both "
        "fan favorites and all new ones. All 16 launch maps from the original Modern Warfare® 2 (2009) have been modernized with new modes and gameplay features and will be available at launch to get everyone started, while over 12 all-new core 6v6 maps will fuel post-launch live seasons.</p><p>"
        "ALL NEW OPEN WORLD ZOMBIES</p><p>For the first time, team up with other squads to survive and fight massive hordes of the undead in the largest Call of Duty® Zombies map ever. Modern Warfare® Zombies (MWZ) tells a new Treyarch Zombies story with missions, core Zombies features, and "
        "secrets "
        "to discover.</p>",
        "rating": 2.89,
        "dates": "2023-11-09",
        "background_img": "https://media.rawg.io/media/games/b17/b17ce7ab3187cc3f42d263d9511adac0.jpg",
        "platforms": {"PC": True, "Xbox": True, "PlayStation": True, "Nintendo": True},
        "rating_count": 100,
        "rating_total": 289.0,
        "genre": "Shooter",
        "developers": "Raven Software",
        "rawg_pk": "964285",
        "reviews_count": 0,
    },
    {
        "name": "Battlefield 2042",
        "description": "<p>Battlefield™ 2042 is a first-person shooter that marks the return to the iconic all-out warfare of the franchise. Adapt and overcome in a near-future world transformed by disorder. Squad up and bring a cutting-edge arsenal into dynamically-changing battlegrounds "
        "supporting 128 players, unprecedented scale, and epic destruction.<br /> ALL-OUT WARFARE<br /> The next generation of fan-favorites Conquest and Breakthrough features the largest Battlefield maps ever and up to 128 players. Experience the intensity of all-out warfare on maps filled with "
        'dynamic weather and spectacular world events.<br /> Conquest<br /> Battlefield\'s massive, iconic sandbox mode returns - this time supporting 128 players on PC. The maps have been specifically designed for this vast scale, with action divided into "clusters" of various kinds. Also, the '
        "action now centers around sectors consisting of several flags instead of individual control points.</p><p>Breakthrough<br /> The return of Breakthrough sees two teams - Attackers and Defenders - battle over larger-scale sectors as the Attackers push towards the final objective. "
        "Each sector is designed to house a larger number of players, enabling more strategic choice and more flanking opportunities. Approach the capture areas from multiple locations and take advantage of more types of tactical possibilities.<br /> BATTLEFIELD PORTAL</p><p>Discover "
        "unexpected battles and enter the wide universe of Battlefield in a community-driven platform that gives you the power to change the rules of war. The possibilities are endless when you can customize weapons, gear, rules, and more in this creative sandbox mode. Replay classic experiences "
        "with select content from Battlefield 1942, Battlefield 3, and Battlefield: Bad Company 2, or leverage the modern content from the world of Battlefield 2042 to discover, create, and share something completely new.<br /> BATTLEFIELD HAZARD ZONE</p><p>A tense, squad-focused survival "
        "experience, Battlefield Hazard Zone combines edge-of-your-seat gameplay with the best of the Battlefield sandbox. Inserted as a four-member squad, you must locate and retrieve critical Data Drives scattered throughout the battlefield, while competing against opposing squads with the same "
        "objective and local militias. Succeed by gathering the Data Drives and choosing when to extract before a storm overtakes the area in this high-stakes, one-life experience. Every bullet, every skirmish, and every decision counts.</p>",
        "rating": 2.82,
        "dates": "2021-11-12",
        "background_img": "https://media.rawg.io/media/games/af2/af2b640fa820e8a8135948a4cd399539.jpg",
        "platforms": {"PC": True, "Xbox": True, "PlayStation": True, "Nintendo": True},
        "rating_count": 100,
        "rating_total": 282.0,
        "genre": "Shooter",
        "developers": "Electronic Arts DICE",
        "rawg_pk": "614954",
        "reviews_count": 0,
    },
    {
        "name": "Payday 3",
        "description": "<p>PAYDAY 3 is the much anticipated sequel to one of the most popular co-op shooters ever. Since its release, PAYDAY-players have been reveling in the thrill of a perfectly planned and executed heist. That's what makes PAYDAY a high-octane, co-op FPS experience without "
        "equal.</p>",
        "rating": 2.85,
        "dates": "2023-09-21",
        "background_img": "https://media.rawg.io/media/games/06b/06b488134abac3462843e4db8e3833a4.jpg",
        "platforms": {"PC": True, "Xbox": True, "PlayStation": True, "Nintendo": True},
        "rating_count": 100,
        "rating_total": 285.0,
        "genre": "Shooter",
        "developers": "OVERKILL Software",
        "rawg_pk": "502116",
        "reviews_count": 0,
    },
]

screenshots = [
    ("https://media.rawg.io/media/screenshots/ed1/ed1b906360e140f17bf5bc50251854e7.jpg", "10040"),
    ("https://media.rawg.io/media/screenshots/28d/28de91fba566b636af4c24c0f684f32a.jpg", "10040"),
    ("https://media.rawg.io/media/screenshots/291/291bf54833ba12c06677f8610f297c9c.jpg", "10040"),
    ("https://media.rawg.io/media/screenshots/98e/98ebe172eee05804cb0733dd8dd96c87.jpg", "10040"),
    ("https://media.rawg.io/media/screenshots/921/921825eddb2e66665614336f10f1ad1b.jpg", "10040"),
    ("https://media.rawg.io/media/screenshots/5a1/5a1c9fa94354fbb6d433df528b79fc93.jpg", "10040"),
    ("https://media.rawg.io/media/screenshots/0ff/0ff3e712e2a55077df5e4a424c7b598c.jpg", "42215"),
    ("https://media.rawg.io/media/screenshots/166/1660e1c803adefcbb8cd3576a0f644f6.jpg", "42215"),
    ("https://media.rawg.io/media/screenshots/a91/a91ffe57f21c918f3ddc8d7cc0d9a548.jpg", "42215"),
    ("https://media.rawg.io/media/screenshots/82d/82d712526c08869f3c5bacdc51dc77ec.jpg", "42215"),
    ("https://media.rawg.io/media/screenshots/3e0/3e087ac78395076b285568c6ef069b9e.jpg", "42215"),
    ("https://media.rawg.io/media/screenshots/066/066a1df009c2ecc03a3b687cca001352.jpg", "42215"),
    ("https://media.rawg.io/media/screenshots/6e2/6e233cb03537d7f590d40c638dc9987d.jpg", "13779"),
    ("https://media.rawg.io/media/screenshots/48a/48aee798c1e4725acfdc729e92865041.jpg", "13779"),
    ("https://media.rawg.io/media/screenshots/32f/32f60c733eb467786397b6b08953f7d6.jpg", "13779"),
    ("https://media.rawg.io/media/screenshots/a9d/a9d333e26e758d74c6ce93d82706095f.jpg", "13779"),
    ("https://media.rawg.io/media/screenshots/4f2/4f24c59ac7ba91590d7394acac0bfae8.jpg", "13779"),
    ("https://media.rawg.io/media/screenshots/5d1/5d181fee516071f756c0323294e44f99.jpg", "19241"),
    ("https://media.rawg.io/media/screenshots/005/0051b18a00e402f3b2be8c8575706a85.jpg", "19241"),
    ("https://media.rawg.io/media/screenshots/afa/afac955e61a406026edb327a71030d01.jpg", "19241"),
    ("https://media.rawg.io/media/screenshots/e40/e404f5042ab0292bbce4d203f1536c06.jpg", "19241"),
    ("https://media.rawg.io/media/screenshots/906/906e199b2dfd9201812321ca7f1ac8d6.jpg", "19241"),
    ("https://media.rawg.io/media/screenshots/6dd/6ddf01f1dc3c54b93d9d57240cd75c3d.jpg", "19241"),
    ("https://media.rawg.io/media/screenshots/8b8/8b81f703d92ce0bc95525bbfee2c1d06.jpg", "58618"),
    ("https://media.rawg.io/media/screenshots/f22/f226505b40915d34b614cfcb47bdefee.jpg", "58618"),
    ("https://media.rawg.io/media/screenshots/4f0/4f0d7af95e5db9bd6d733dd6f2ccf166.jpg", "58618"),
    ("https://media.rawg.io/media/screenshots/1e8/1e8748dc5048a816334f44d7d8e7f812.jpg", "51350"),
    ("https://media.rawg.io/media/screenshots/b07/b078c498ee7664fe21e54c596ce5b0c3.jpg", "51350"),
    ("https://media.rawg.io/media/screenshots/e3c/e3c3b0c644e11df670c75b282933b296.jpg", "51350"),
    ("https://media.rawg.io/media/screenshots/79c/79c070457179f72c0133a2a67143556d.jpg", "51350"),
    ("https://media.rawg.io/media/screenshots/7fc/7fceb418d948de09dcb25df1794a7a7a.jpg", "51350"),
    ("https://media.rawg.io/media/screenshots/63b/63bd4904de4a4dcc58f86b6d75651631.jpg", "452633"),
    ("https://media.rawg.io/media/screenshots/3ba/3ba37890dec761493add08abab7e1cb9.jpg", "452633"),
    ("https://media.rawg.io/media/screenshots/5b3/5b32c70f6fb30ae5879c3ac93f2351dd.jpg", "452633"),
    ("https://media.rawg.io/media/screenshots/1f0/1f02bf3b452bdd54bc36b7787ec7f384.jpg", "452633"),
    ("https://media.rawg.io/media/screenshots/a4b/a4b7954426e5ad8e612d5bd2d856bb9e.jpg", "452633"),
    ("https://media.rawg.io/media/screenshots/1bb/1bbfc8b0b6015879d8a75f2718d50ba4.jpg", "452633"),
    ("https://media.rawg.io/media/screenshots/36f/36f941f72e2b2a41629f5fb3bd448688.jpg", "326243"),
    ("https://media.rawg.io/media/screenshots/290/29096848622521df7555850000236cb6.jpg", "326243"),
    ("https://media.rawg.io/media/screenshots/807/807685454ea8fb87363eedd49677f49b.jpg", "326243"),
    ("https://media.rawg.io/media/screenshots/2ee/2eea4d4cce2836f689d9d39d2a4a94d5.jpg", "326243"),
    ("https://media.rawg.io/media/screenshots/de9/de9b28bdd0bdb9937c7f82e55f845bb6.jpg", "326243"),
    ("https://media.rawg.io/media/screenshots/3a2/3a2e5f31e2061bc566bcfd30fda56a17.jpg", "326243"),
    ("https://media.rawg.io/media/screenshots/1c9/1c9ae7a68285ad0d4aa046b22bcdc4bf.jpg", "58829"),
    ("https://media.rawg.io/media/screenshots/f67/f670247976d1b8121a5149bdfd8dbc21.jpg", "58829"),
    ("https://media.rawg.io/media/screenshots/e3e/e3eaf49fe84fdc175e07d86d13e5bec5.jpg", "58829"),
    ("https://media.rawg.io/media/screenshots/59d/59df418ec1f82e1410a19f33db40ddce.jpg", "58829"),
    ("https://media.rawg.io/media/screenshots/2e7/2e761888447bae01026e2b882dd4fdab.jpg", "58829"),
    ("https://media.rawg.io/media/screenshots/5ee/5ee9e40bc55def84bfccab09b324f220.jpg", "58829"),
    ("https://media.rawg.io/media/screenshots/e72/e72929ca1e26e1243ba32213905ffbf4.jpg", "58084"),
    ("https://media.rawg.io/media/screenshots/575/575cc0244161649a74e1a290fb7eee8e.jpg", "58084"),
    ("https://media.rawg.io/media/screenshots/728/728fa0cc969c86222bf70e14deeb6d54.jpg", "58084"),
    ("https://media.rawg.io/media/screenshots/ee7/ee7c5b9dd1703cc4ef7eb2069edf7bf0.jpg", "58084"),
    ("https://media.rawg.io/media/screenshots/441/44169f7d62e183cf226673bb7610a8bd.jpg", "58084"),
    ("https://media.rawg.io/media/screenshots/683/6830fbd1b33cdb4876bdbf8fc5f42d00.jpg", "58084"),
    ("https://media.rawg.io/media/screenshots/1ac/1ac19f31974314855ad7be266adeb500.jpg", "3328"),
    ("https://media.rawg.io/media/screenshots/6a0/6a08afca95261a2fe221ea9e01d28762.jpg", "3328"),
    ("https://media.rawg.io/media/screenshots/cdd/cdd31b6b4a687425a87b5ce231ac89d7.jpg", "3328"),
    ("https://media.rawg.io/media/screenshots/862/862397b153221a625922d3bb66337834.jpg", "3328"),
    ("https://media.rawg.io/media/screenshots/166/166787c442a45f52f4f230c33fd7d605.jpg", "3328"),
    ("https://media.rawg.io/media/screenshots/f63/f6373ee614046d81503d63f167181803.jpg", "3328"),
    ("https://media.rawg.io/media/screenshots/3bd/3bd2710bd1ffb6664fdea7b83afd067e.jpg", "5679"),
    ("https://media.rawg.io/media/screenshots/d4e/d4e9b13f54748584ccbd6f998094dade.jpg", "5679"),
    ("https://media.rawg.io/media/screenshots/599/59946a630e9c7871003763d63184404a.jpg", "5679"),
    ("https://media.rawg.io/media/screenshots/c5d/c5dad426038d7d12f933eedbeab48ff3.jpg", "5679"),
    ("https://media.rawg.io/media/screenshots/b32/b326fa01c82db82edd41ed299886ee44.jpg", "5679"),
    ("https://media.rawg.io/media/screenshots/091/091e95b49d5a22de036698fc731395a2.jpg", "5679"),
    ("https://media.rawg.io/media/screenshots/80f/80fae78e5c12be23386e1f68786c8b4b.jpg", "846303"),
    ("https://media.rawg.io/media/screenshots/078/078cfcc88982199f6e1bc6de24279593.jpg", "846303"),
    ("https://media.rawg.io/media/screenshots/da5/da5c912366c9ca2ca282f55ecd3b33c2.jpg", "846303"),
    ("https://media.rawg.io/media/screenshots/fc1/fc10d7ec161911a3bb3409cd0599db05.jpg", "846303"),
    ("https://media.rawg.io/media/screenshots/1de/1def44eac50c83de5d3a0dffbe52b5f9.jpg", "846303"),
    ("https://media.rawg.io/media/screenshots/6cd/6cd9d62ddb5771993d67a565f51c648d.jpg", "846303"),
    ("https://media.rawg.io/media/screenshots/17b/17b87165c8b985ba98e12e0757455379.jpg", "10073"),
    ("https://media.rawg.io/media/screenshots/876/87691068e9f4aafb4fbb35f2e2d6a2ff.jpg", "10073"),
    ("https://media.rawg.io/media/screenshots/1f2/1f294c1ea694982050a22c6e5adcdeed.jpg", "10073"),
    ("https://media.rawg.io/media/screenshots/36e/36eaee6298a5abbd357af09252ef3b9e.jpg", "10073"),
    ("https://media.rawg.io/media/screenshots/f22/f22647647abf428ab63bcda715e118fa.jpg", "10073"),
    ("https://media.rawg.io/media/screenshots/186/1869cd834bb883c97da87be298454c7f.jpg", "10073"),
    ("https://media.rawg.io/media/screenshots/57a/57a10b6c897bc2c21666f4a9bcfdefcc.jpg", "28172"),
    ("https://media.rawg.io/media/screenshots/8bc/8bc2d7c3039918e39c0d0e35f2abbe93.jpg", "28172"),
    ("https://media.rawg.io/media/screenshots/cdd/cdd3304a7c3507d221ff475eb50358c8.jpg", "28172"),
    ("https://media.rawg.io/media/screenshots/c48/c48e46fe5bbe9573acd34b42d955eef8.jpg", "28172"),
    ("https://media.rawg.io/media/screenshots/1ad/1adaff50796645d8914156a69449b6c1.jpg", "28172"),
    ("https://media.rawg.io/media/screenshots/a1e/a1e908e8b1ec42434fc9c4d0fcf6484c.jpg", "28172"),
    ("https://media.rawg.io/media/screenshots/80e/80e7335a1e0b17b56cf33d51dcd92511.jpg", "663742"),
    ("https://media.rawg.io/media/screenshots/642/64225d74838806bc73d680dfab58d9be.jpg", "663742"),
    ("https://media.rawg.io/media/screenshots/0e6/0e62b328b928b108085bd791cd2c4c11.jpg", "663742"),
    ("https://media.rawg.io/media/screenshots/261/261f7c24fcce5b304ece0bf132c086a0.jpg", "663742"),
    ("https://media.rawg.io/media/screenshots/f73/f732024f4054cac5168d3f52a31d213f.jpg", "663742"),
    ("https://media.rawg.io/media/screenshots/c49/c49c56c4e86a2f134c19e95340b557d0.jpg", "663742"),
    ("https://media.rawg.io/media/screenshots/d83/d831b689b904655ac561438b9a7d7e5e.jpg", "4340"),
    ("https://media.rawg.io/media/screenshots/b79/b79014a98ac323be07c722c9af79b75d.jpg", "4340"),
    ("https://media.rawg.io/media/screenshots/24a/24a6c64b252ea8d01463c93c4865dfb1.jpg", "4340"),
    ("https://media.rawg.io/media/screenshots/a87/a87dc902f17812839d2c85a7214215ee.jpg", "4340"),
    ("https://media.rawg.io/media/screenshots/c4d/c4da16731d53edd054dfd7ef9dc5271e.jpg", "4340"),
    ("https://media.rawg.io/media/screenshots/19b/19b7d94704f32ab52eca02181258657b.jpg", "4340"),
    ("https://media.rawg.io/media/screenshots/d68/d6868e5f7bce66e326bd48b11ba24b13.jpeg", "58175"),
    ("https://media.rawg.io/media/screenshots/928/928cdaf4ae204f202d177bbd65e911b3.jpeg", "58175"),
    ("https://media.rawg.io/media/screenshots/a54/a549a06ebe89c570cabb57308c4c42a5.jpeg", "58175"),
    ("https://media.rawg.io/media/screenshots/f02/f0279f8199da3e91134078e737e5fbcf.jpg", "58175"),
    ("https://media.rawg.io/media/screenshots/e87/e87c57660c7c37fe973c6dd6ebcc1ac6.jpeg", "58175"),
    ("https://media.rawg.io/media/screenshots/5b7/5b7280fe437c39d3ce501a867c46a998.jpeg", "58175"),
    ("https://media.rawg.io/media/screenshots/26c/26c884a26259c2da8836f0e32ad73550.jpg", "59233"),
    ("https://media.rawg.io/media/screenshots/87d/87d67f84d7af10606a04cf59418f1d2b.jpg", "59233"),
    ("https://media.rawg.io/media/screenshots/3c0/3c024ab370424597e9f7795008588781_abzTRGg.jpg", "59233"),
    ("https://media.rawg.io/media/screenshots/556/5568a80ed29fe2a5f5f90af79fc43b29.jpg", "59233"),
    ("https://media.rawg.io/media/screenshots/ee6/ee65c953892ab33bca5820ab3f3932a4.jpg", "59233"),
    ("https://media.rawg.io/media/screenshots/4b1/4b1ccb91a2184dd49dfcd2e24af0dbe8_0uF7qGn.jpg", "59233"),
    ("https://media.rawg.io/media/screenshots/2d4/2d4130d059e57c6feaa46d011a302200.jpg", "257192"),
    ("https://media.rawg.io/media/screenshots/6dc/6dca1fc477d41d04a34f4f2380b7b543.JPG", "257192"),
    ("https://media.rawg.io/media/screenshots/1b8/1b8dcf75eeb2eac91f51b098c36e28e2.jpg", "257192"),
    ("https://media.rawg.io/media/screenshots/22f/22f8223f6adb979e5b54830118b5f2d8.jpg", "257192"),
    ("https://media.rawg.io/media/screenshots/6fc/6fcdc92a1b21ba550b2cc6c79bc3f1b3.jpg", "257192"),
    ("https://media.rawg.io/media/screenshots/1a8/1a8a37817ebd4a180cb56af6dbe433b2.jpg", "257192"),
    ("https://media.rawg.io/media/screenshots/5b3/5b39206a3b241688fbd69467d75151b8.jpg", "5563"),
    ("https://media.rawg.io/media/screenshots/286/2861a20b67d61263b5b790cb1ab5e330.jpg", "5563"),
    ("https://media.rawg.io/media/screenshots/7c5/7c5083ee282a2ea3d6248361592cf8af.jpg", "5563"),
    ("https://media.rawg.io/media/screenshots/704/704c2186d4d1e73ca30e4a3f904f7a6c.jpg", "5563"),
    ("https://media.rawg.io/media/screenshots/502/502aacc7e1e71435c29e4dae7ce6c1f3.jpg", "5563"),
    ("https://media.rawg.io/media/screenshots/afe/afecd18ebd303b5cc450777f6beb1dd5.jpg", "5563"),
    ("https://media.rawg.io/media/screenshots/5a8/5a8f06949b0264aa27374d3f005a2842.jpg", "51325"),
    ("https://media.rawg.io/media/screenshots/160/1603055e1fc4fbbea395809242d23c67_CDpXDx3.jpg", "51325"),
    ("https://media.rawg.io/media/screenshots/e9c/e9cfbbc7821827e04c890ecf087c246c.jpg", "51325"),
    ("https://media.rawg.io/media/screenshots/e58/e58f17219570ca451356f6eec746e697.jpg", "51325"),
    ("https://media.rawg.io/media/screenshots/02a/02aede3e5e6738e37ff1240c1c2fcee8.jpg", "51325"),
    ("https://media.rawg.io/media/screenshots/5ea/5ea913f25ebb5454571e8d92deddebcc.jpg", "51325"),
    ("https://media.rawg.io/media/screenshots/544/5446711a9711031d937134d0e8040a06.jpg", "259801"),
    ("https://media.rawg.io/media/screenshots/b5d/b5d7f11c81bb76c16b2d82328875f3d0.jpg", "259801"),
    ("https://media.rawg.io/media/screenshots/eae/eae67ac6787641e0cadcfe1f854c015a.jpg", "259801"),
    ("https://media.rawg.io/media/screenshots/0eb/0ebeaf82965655f37a71c446263efce5.jpg", "259801"),
    ("https://media.rawg.io/media/screenshots/96d/96da5da8a2ae31624d70de21f3b9ea64.jpg", "259801"),
    ("https://media.rawg.io/media/screenshots/281/28166327e5932bb0241a59474bea4dfe.jpg", "259801"),
    ("https://media.rawg.io/media/screenshots/6c9/6c9d036518f78895ddf552d2cb7421d6.jpg", "452638"),
    ("https://media.rawg.io/media/screenshots/444/44480d0f02c17e41dd1d9b58affad214.jpg", "452638"),
    ("https://media.rawg.io/media/screenshots/e38/e38f600f4ad9145d0bcba128064503db.jpg", "452638"),
    ("https://media.rawg.io/media/screenshots/d44/d4419651cfdcc780e660393d49e67e05.jpg", "58133"),
    ("https://media.rawg.io/media/screenshots/d77/d77481bae3f6f58d5d47636ee309819c.jpg", "58133"),
    ("https://media.rawg.io/media/screenshots/8b0/8b0825d8be950e428476a50f9059096d.jpg", "58133"),
    ("https://media.rawg.io/media/screenshots/eff/eff1913661d119b936acdce4f60b7c1b.jpg", "58133"),
    ("https://media.rawg.io/media/screenshots/cd6/cd695ba8bbdcd652be697f92f00669db.jpg", "58133"),
    ("https://media.rawg.io/media/screenshots/c9c/c9cd2a421d61daf120730cc9cf5a5ed5.jpg", "3501"),
    ("https://media.rawg.io/media/screenshots/e51/e51a5504204bf70b6e4c755eabcb24b4.jpg", "3501"),
    ("https://media.rawg.io/media/screenshots/7e7/7e75c498b88302329a22ab1746ef1ecb.jpg", "3501"),
    ("https://media.rawg.io/media/screenshots/fec/fec3ebe4f683f7eabd94c3d3dba89c7b.jpg", "3501"),
    ("https://media.rawg.io/media/screenshots/5dd/5dd51e66568b6340b507289e06b3bc31.jpg", "3501"),
    ("https://media.rawg.io/media/screenshots/a4d/a4dbd520c91bccd770f1c03ac6f47b7b.jpg", "3501"),
    ("https://media.rawg.io/media/screenshots/283/283d452a01e1764f1342c2e804354e0f.jpg", "964285"),
    ("https://media.rawg.io/media/screenshots/852/8526ca9bba22926f181ddc4103dc4bd1.jpg", "964285"),
    ("https://media.rawg.io/media/screenshots/91b/91b76801486bd5729d6701fd30926c93.jpg", "964285"),
    ("https://media.rawg.io/media/screenshots/dec/decf17aa22797ca9c62fa3e729490930.jpg", "964285"),
    ("https://media.rawg.io/media/screenshots/9d7/9d7b98b03297d57f160bff064fb8f9c0.jpg", "964285"),
    ("https://media.rawg.io/media/screenshots/6ff/6ff89ca990c253e057107b010ba14268.jpg", "964285"),
    ("https://media.rawg.io/media/screenshots/9ed/9ed4bf5d435eb474356035a7ec82ba41.jpg", "614954"),
    ("https://media.rawg.io/media/screenshots/632/632e025e51ba0d1a7d9727127c82e120.jpg", "614954"),
    ("https://media.rawg.io/media/screenshots/620/62077f8d055790264a23f2d9913d4c4e.jpg", "614954"),
    ("https://media.rawg.io/media/screenshots/08c/08ca36f6eea8826eda4e301de4d11abf.jpg", "614954"),
    ("https://media.rawg.io/media/screenshots/dc0/dc05ee5df5a3f8f8a31b317fdbae1a5d.jpg", "614954"),
    ("https://media.rawg.io/media/screenshots/d7b/d7b5532cc563bfa3218c2548b0f513f2.jpg", "614954"),
    ("https://media.rawg.io/media/screenshots/247/247ddb2de2c39921423ca582347857dc.jpg", "502116"),
    ("https://media.rawg.io/media/screenshots/4f6/4f6997291a704814b2836abd6e4d091e.jpg", "502116"),
    ("https://media.rawg.io/media/screenshots/35f/35f79826676ebc2cbdea3331b6680e9e_buLPO2C.jpg", "502116"),
    ("https://media.rawg.io/media/screenshots/314/314eb8325f7cef58b38914e5b7b5d218.jpg", "502116"),
    ("https://media.rawg.io/media/screenshots/979/979bb0a64abd0f3d2601763ff77091ae.jpg", "502116"),
    ("https://media.rawg.io/media/screenshots/716/71605b47d3a160ec5fb22e5d036f4fe6.jpg", "502116"),
]

stores = [
    ("http://store.steampowered.com/app/281990/", "10040", "PC"),
    ("https://store.steampowered.com/app/239140", "42215", "PC"),
    ("https://www.microsoft.com/en-us/store/p/dying-light/bxn9lb6r3zpg?cid=msft_web_chart", "42215", "Xbox"),
    ("https://store.playstation.com/en-us/product/UP1018-CUSA00078_00-DYINGLIGHTGAME00", "42215", "PlayStation"),
    ("https://www.nintendo.com/games/detail/dying-light-platinum-edition-switch/", "42215", "Nintendo"),
    ("http://store.steampowered.com/app/3990/", "13779", "PC"),
    ("http://store.steampowered.com/app/22130/", "19241", "PC"),
    ("http://store.steampowered.com/app/718560/", "51350", "PC"),
    ("https://store.playstation.com/en-us/concept/10000956", "452633", "PlayStation"),
    ("https://store.playstation.com/en-us/concept/10000333/", "326243", "PlayStation"),
    ("https://store.steampowered.com/app/1245620", "326243", "PC"),
    ("https://www.microsoft.com/en-us/p/elden-ring/9p3j32ctxlrz", "326243", "Xbox"),
    ("https://e3.nintendo.com/games/super-smash-bros-ultimate-switch/", "58829", "Nintendo"),
    ("https://store.steampowered.com/app/742120", "58084", "PC"),
    ("https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/", "3328", "PC"),
    ("https://www.microsoft.com/en-us/p/the-witcher-3-wild-hunt/br765873cqjd", "3328", "Xbox"),
    ("https://store.playstation.com/en-us/product/UP4497-CUSA00527_00-0000000000000002", "3328", "PlayStation"),
    ("https://www.nintendo.com/games/detail/the-witcher-3-wild-hunt-switch/", "3328", "Nintendo"),
    ("https://store.playstation.com/en-us/product/UP1003-BLUS30778_00-TESVSKYRIM000000", "5679", "PlayStation"),
    ("http://store.steampowered.com/app/72850/", "5679", "PC"),
    ("https://www.nintendo.com/games/detail/the-elder-scrolls-v-skyrim-switch", "5679", "Nintendo"),
    ("https://marketplace.xbox.com/en-US/Product/Skyrim/66acd000-77fe-1000-9115-d802425307e6", "5679", "Xbox"),
    ("https://store.playstation.com/en-us/product/UP4497-PPSA03974_00-EXPANSION1000000", "846303", "PlayStation"),
    ("https://store.steampowered.com/app/2138330/Cyberpunk_2077/", "846303", "PC"),
    ("http://store.steampowered.com/app/435150/", "10073", "PC"),
    ("http://store.steampowered.com/app/379430/", "28172", "PC"),
    ("https://store.playstation.com/en-us/product/UP2047-CUSA07238_00-KCDGAME010000000", "28172", "PlayStation"),
    ("https://www.microsoft.com/en-us/store/p/kingdom-come-deliverance/bnbwfh89fcf1?cid=msft_web_chart", "28172", "Xbox"),
    ("https://store.steampowered.com/app/1817070/Marvels_SpiderMan_Remastered/", "663742", "PC"),
    ("https://store.playstation.com/en-gb/product/EP9000-CUSA03280_00-UNCHARTEDFORTUNE", "4340", "PlayStation"),
    ("https://store.playstation.com/en-us/product/UP9000-CUSA07408_00-00000000GODOFWAR", "58175", "PlayStation"),
    ("https://store.steampowered.com/app/1593500/God_of_War/", "58175", "PC"),
    ("https://www.microsoft.com/en-us/p/destiny-2-forsaken-legendary-collection/c25jldq0wsf4?cid=msft_web_chart", "59233", "Xbox"),
    ("https://www.microsoft.com/en-us/p/psychonauts-2/9nbr2vxt87sj?activetab=pivot:overviewtab", "257192", "Xbox"),
    ("https://store.steampowered.com/app/607080/", "257192", "PC"),
    ("http://store.steampowered.com/app/22380/", "5563", "PC"),
    ("https://store.playstation.com/en-us/product/UP1003-BLUS30500_00-FALLOUTNEWVEGAS0", "5563", "PlayStation"),
    ("https://www.xbox.com/en-us/games/store/fallout-new-vegas/bx3jnk07z6qk?cid=msft_web_chart", "5563", "Xbox"),
    ("https://store.playstation.com/en-us/product/UP9000-CUSA07820_00-THELASTOFUSPART2", "51325", "PlayStation"),
    ("https://store.playstation.com/en-us/product/UP0082-CUSA07211_00-FFVIIREMAKE00000", "259801", "PlayStation"),
    ("https://store.steampowered.com/app/1462040/FINAL_FANTASY_VII_REMAKE_INTERGRADE/", "259801", "PC"),
    ("https://store.steampowered.com/app/1332010/Stray/", "452638", "PC"),
    ("https://store.playstation.com/en-us/concept/10001114", "452638", "PlayStation"),
    ("https://store.playstation.com/en-us/product/UP0002-CUSA12125_00-SPYROTRILOGY0001", "58133", "PlayStation"),
    ("https://www.microsoft.com/en-us/store/p/spyro-reignited-trilogy/bwhfznsl0pb5?cid=msft_web_chart", "58133", "Xbox"),
    ("https://www.nintendo.com/games/detail/spyro-reignited-trilogy-switch/", "58133", "Nintendo"),
    ("https://store.steampowered.com/app/996580/", "58133", "PC"),
    ("https://store.playstation.com/en-us/product/UP9000-NPUA81116_00-LBP3GAME00000001", "3501", "PlayStation"),
    ("https://store.playstation.com/en-us/product/UP0002-PPSA01649_00-CODMW3CROSSGEN01", "964285", "PlayStation"),
    ("https://store.steampowered.com/app/2519060/Call_of_Duty_Modern_Warfare_III/", "964285", "PC"),
    ("https://store.steampowered.com/app/1517290", "614954", "PC"),
    ("https://store.playstation.com/en-us/concept/10000758", "614954", "PlayStation"),
    ("https://www.microsoft.com/en-us/p/battlefield-2042/9PK077NP44X2?rtc=1&source=lp&activetab=pivot:overviewtab", "614954", "Xbox"),
    ("https://store.steampowered.com/app/1272080/PAYDAY_3/", "502116", "PC"),
]


def seed_data():
    with pool.connection() as conn:
        with conn.cursor() as cur:
            # 1. Seed icons if empty
            cur.execute("SELECT COUNT(*) FROM icons")
            result = cur.fetchone()
            if result and result[0] == 0:
                cur.executemany("INSERT INTO icons (name, icon_url) VALUES (%s, %s)", icons)
            # 2. Prepare games data
            cur.execute("SELECT COUNT(*) FROM gamesdb")
            result = cur.fetchone()
            if result and result[0] == 0:
                games_data: list[dict[str, Any]] = []
                for game in games:
                    games_data.append(
                        {
                            "name": game["name"],
                            "description": game["description"],
                            "rating": float(game["rating"]),
                            "dates": game["dates"],
                            "background_img": game["background_img"],
                            "xbox": game["platforms"].get("Xbox", False),
                            "playstation": game["platforms"].get("PlayStation", False),
                            "nintendo": game["platforms"].get("Nintendo", False),
                            "pc": game["platforms"].get("PC", False),
                            "rating_count": game["rating_count"],
                            "rating_total": game["rating_total"],
                            "genre": game["genre"],
                            "developers": game["developers"],
                            "rawg_pk": game["rawg_pk"],
                            "reviews_count": game["reviews_count"],
                        }
                    )
                # 3. Bulk insert games
                cur.executemany(
                    """
                    INSERT INTO gamesdb (
                        name, description, rating, dates, background_img,
                        Xbox, PlayStation, Nintendo, PC,
                        rating_count, rating_total, genre, developers, rawg_pk, reviews_count
                    ) VALUES (
                        %(name)s, %(description)s, %(rating)s, %(dates)s, %(background_img)s,
                        %(xbox)s, %(playstation)s, %(nintendo)s, %(pc)s,
                        %(rating_count)s, %(rating_total)s, %(genre)s, %(developers)s, %(rawg_pk)s, %(reviews_count)s
                    )
                    """,
                    games_data,
                )
            # 4. Bulk insert screenshots
            cur.execute("SELECT COUNT(*) FROM screenshots")
            result = cur.fetchone()
            if result and result[0] == 0:
                cur.executemany("INSERT INTO screenshots (image_url, rawg_pk) VALUES (%s, %s)", screenshots)
            # 5. Bulk insert stores
            cur.execute("SELECT COUNT(*) FROM storesdb")
            result = cur.fetchone()
            if result and result[0] == 0:
                cur.executemany("INSERT INTO storesdb (url, rawg_pk, platform) VALUES (%s, %s, %s)", stores)
