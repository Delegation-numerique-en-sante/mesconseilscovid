parcelRequire=function(e){var r="function"==typeof parcelRequire&&parcelRequire,n="function"==typeof require&&require,i={};function u(e,u){if(e in i)return i[e];var t="function"==typeof parcelRequire&&parcelRequire;if(!u&&t)return t(e,!0);if(r)return r(e,!0);if(n&&"string"==typeof e)return n(e);var o=new Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}return u.register=function(e,r){i[e]=r},i=e(u),u.modules=i,u}(function (require) {var b="network-or-cache-2022-03-09",c=["/","robots.txt","/style.bac955ef.css","/main.8bb55c9f.js","/cas-contact-a-risque.html","/conseils-pour-les-enfants.html","/conseils-pour-les-jeunes.html","/symptomes-persistants-covid-long.html","/j-ai-des-symptomes-covid.html","/je-suis-vaccine.html","/je-veux-me-faire-vacciner.html","/je-vis-avec-personne-covid-positive.html","/pass-sanitaire-qr-code-voyages.html","/covid-et-travail.html","/covid-in-france.html","/tests-de-depistage.html","/rappel-vaccinal-3e-dose.html","/marianne-regular-webfont.b44facd6.woff2","/marianne-bold-webfont.a256cae5.woff2","/site.webmanifest","/android-chrome-192x192.b546dfbb.png","/android-chrome-384x384.8b7117b4.png","/android-chrome-512x512.be0298e4.png","/android-chrome-512x512-maskable.7a52c8e4.png","/apple-touch-icon.3767cda9.png","/safari-pinned-tab.b619e5b5.svg","mstile-150x150.png","/favicon.9c049fd2.ico","/favicon-16x16.6bef8fc7.png","/favicon-32x32.5f683cea.png","/marianne.865c4ace.png","/arrow-left.58cb70ef.svg","/arrow-right-white.7fa61126.svg","/arrow-right-blue.f2a52c92.svg","/ei-share-apple.3406814b.svg","/printer.54413b82.svg","/feedback-negatif.d7720271.svg","/feedback-positif.4e27c6f0.svg","/feedback-contact.d4ba9273.svg","/feedback-partager.e335cc3b.svg","/feedback-flag.6b9fd356.svg","/feedback-social-messenger.9ca65404.svg","/feedback-social-whatsapp.ada2db6b.svg","/logo-titre.644c6cbb.png","/logo-carre.c4abe76d.png","/select.83f99688.svg","/star.c032ebcb.svg","/trash.8f1780e9.svg","/plus-circle.9e991861.svg","/user-circle.de57182f.svg","/user-circle-blue.bf4b822f.svg","/icone_video.40f9ce90.svg","/icone_fiche.24071d75.svg","/icone_infographie.581d9f73.svg","/timeline-arrow.a2ec15f7.svg","/activitepro.d6eedade.svg","/contact_medecin.0c9ea03d.svg","/contactarisque.5fd88f1a.svg","/covid.cb851765.svg","/depistage.35afad29.svg","/deplacements.d16eb120.svg","/foyer.1d755664.svg","/gestesbarrieres.1d723c6e.svg","/grossesse.2816b4be.svg","/isolement.36c336a0.svg","/jeunes.d10ff340.svg","/nom.cacdd54a.svg","/pass_sanitaire.19b54329.svg","/pediatrieecole.8efd7e3c.svg","/pediatriegeneral.fe21057f.svg","/pediatriemedical.a920eb5c.svg","/sante.58d3fe93.svg","/situation.d3029001.svg","/symptomesactuels.3cdb7555.svg","/symptomespasses.d1d7c671.svg","/travail.b05a6eeb.svg","/vaccins.8cee81c1.svg","/suivi_gravite.e3aad7d5.svg","/suivi_gravite_superieure.c6113f27.svg","/suivi_ok.5568e219.svg","/suivi_stable.4f4ec377.svg","/suivi_interrogation.e697a9bd.svg"],d=2e3;function f(){return caches.keys().then(function(e){return Promise.all(e.map(function(e){if(e!==b)return console.log("Deleting old cache",e),caches.delete(e)}))})}function g(){return caches.open(b).then(function(e){return e.addAll(c)})}function h(e,s){return new Promise(function(t,i){var a=setTimeout(i,s);fetch(e).then(function(e){clearTimeout(a),t(e)},i)})}function j(e){return caches.open(b).then(function(s){return s.match(e).then(function(e){return e||Promise.reject("no-match")})})}self.addEventListener("install",function(e){console.log("The service worker is being installed"),e.waitUntil(g())}),self.addEventListener("message",function(e){"skipWaiting"===e.data&&(console.log("Activating service worker now (skip waiting)"),self.skipWaiting())}),self.addEventListener("activate",function(e){e.waitUntil(f().then(function(){console.log("The service worker is ready to handle fetches")}))}),self.addEventListener("fetch",function(e){e.respondWith(h(e.request,d).catch(function(){return console.debug("Service worker serving ".concat(e.request.url," from cache")),j(e.request)}))});return{"AaGI":{}};});