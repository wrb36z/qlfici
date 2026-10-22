
/* ==============================
   JA PLÉCHÂTEL - SCRIPT
============================== */

document.addEventListener("DOMContentLoaded", () => {

    // ANNÉE AUTOMATIQUE

    const annee = document.getElementById("year");

    if (annee) {
        annee.textContent = new Date().getFullYear();
    }

    // MENU MOBILE

    const boutonMenu = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".navigation");

    if (boutonMenu && navigation) {

        boutonMenu.addEventListener("click", () => {
            const ouvert =
                boutonMenu.getAttribute("aria-expanded") === "true";

            boutonMenu.setAttribute(
                "aria-expanded",
                String(!ouvert)
            );

            navigation.classList.toggle("active", !ouvert);
        });

        navigation.querySelectorAll("a").forEach(lien => {
            lien.addEventListener("click", () => {
                navigation.classList.remove("active");
                boutonMenu.setAttribute("aria-expanded", "false");
            });
        });

    }

    // CHARGEMENT DES MATCHS

    chargerMatchs();

});


/* ==============================
   OUTILS
============================== */

function afficher(id, valeur) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = valeur;
    }
}

function texteValide(valeur, defaut) {
    return typeof valeur === "string" && valeur.trim()
        ? valeur
        : defaut;
}

function formaterDate(valeur) {
    if (!valeur) return "Date à confirmer";

    const date = new Date(valeur);

    if (Number.isNaN(date.getTime())) {
        return String(valeur);
    }

    return date.toLocaleString("fr-FR", {
        dateStyle: "full",
        timeStyle: "short"
    });
}


/* ==============================
   SYNCHRONISATION MATCHS
============================== */

async function chargerMatchs() {

    try {

        const reponse = await fetch("./matchs.json", {
            cache: "no-store"
        });

        if (!reponse.ok) {
            throw new Error("Impossible de charger matchs.json");
        }

        const donnees = await reponse.json();

        // PROCHAIN MATCH

        const prochain = donnees.prochain_match;

        if (prochain && typeof prochain === "object") {

            afficher(
                "date-prochain-match",
                formaterDate(prochain.date)
            );

            afficher(
                "equipe-domicile",
                texteValide(prochain.domicile, "À confirmer")
            );

            afficher(
                "equipe-exterieur",
                texteValide(prochain.exterieur, "À confirmer")
            );

            afficher(
                "prochain-match",
                texteValide(prochain.lieu, "Lieu à confirmer")
            );

        } else {

            afficher(
                "prochain-match",
                "En attente des données officielles FFF"
            );

        }

        // DERNIER RÉSULTAT

        const dernier = donnees.dernier_resultat;

        if (dernier && typeof dernier === "object") {

            afficher(
                "date-dernier-match",
                formaterDate(dernier.date)
            );

            afficher(
                "resultat-domicile",
                texteValide(dernier.domicile, "À confirmer")
            );

            afficher(
                "resultat-exterieur",
                texteValide(dernier.exterieur, "À confirmer")
            );

            const scoresValides =
                dernier.score_domicile !== null &&
                dernier.score_domicile !== undefined &&
                dernier.score_exterieur !== null &&
                dernier.score_exterieur !== undefined;

            afficher(
                "score-dernier-match",
                scoresValides
                    ? `${dernier.score_domicile} : ${dernier.score_exterieur}`
                    : "– : –"
            );

            afficher(
                "dernier-resultat",
                texteValide(dernier.competition, "Résultat officiel")
            );

        } else {

            afficher(
                "dernier-resultat",
                "En attente des résultats officiels FFF"
            );

        }

        // DATE DE MISE À JOUR

        if (donnees.derniere_mise_a_jour) {

            afficher(
                "maj-matchs",
                "Dernière mise à jour : " +
                formaterDate(donnees.derniere_mise_a_jour)
            );

        } else {

            afficher(
                "maj-matchs",
                "Synchronisation FFF en attente"
            );

        }

    } catch (erreur) {

        console.error("Erreur des matchs :", erreur);

        afficher(
            "prochain-match",
            "Impossible de charger les matchs"
        );

        afficher(
            "dernier-resultat",
            "Impossible de charger les résultats"
        );

        afficher(
            "maj-matchs",
            "Données indisponibles"
        );

    }

}
