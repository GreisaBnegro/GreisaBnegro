const promo = document.getElementById("seasonalPromo");

const seasonEmoji = document.getElementById("seasonEmoji");
const promoTitle = document.getElementById("promoTitle");
const promoDescription = document.getElementById("promoDescription");
const promoLink = document.getElementById("promoLink");

function getSeason() {
    const month = new Date().getMonth() + 1;

    if (month >= 3 && month <= 5) {
        return "spring";
    }

    if (month >= 6 && month <= 8) {
        return "summer";
    }

    if (month >= 9 && month <= 11) {
        return "autumn";
    }

    return "winter";
}

function loadSeasonalPromotion() {
    const season = getSeason();

    const promotions = {
        spring: {
            emoji: "🌸",
            title: "Magnets Collection",
            description:
                "Spring is here. Discover our latest magnets and magnetic accessories.",
            link: "../magneticGem.html"
        },

        summer: {
            emoji: "🍹",
            title: "Metal Cases",
            description:
                "Protect your gear this summer with our premium metal cases.",
            link: "../metal.html"
        },

        autumn: {
            emoji: "🍂",
            title: "Potion Game",
            description:
                "Autumn adventures await. Enter the magical world of Potion Game.",
            link: "../potionGem.html"
        },

        winter: {
            emoji: "🐻‍❄️ྀིྀི",
            title: "Cryogenic Experience",
            description:
                "Explore our Cryogenic page and discover cold-weather innovations.",
            link: "../cryFile.html"
        }
    };

    const current = promotions[season];

    promo.classList.add(season);

    seasonEmoji.textContent = current.emoji;
    promoTitle.textContent = current.title;
    promoDescription.textContent = current.description;
    promoLink.href = current.link;
}

loadSeasonalPromotion();