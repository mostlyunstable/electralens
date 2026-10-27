"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Locale = "en" | "hi";

export interface Translations {
  [key: string]: string;
}

export const translations: Record<Locale, Translations> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.compare": "Compare",
    "nav.findings": "Findings",
    "nav.methodology": "Methodology",
    "nav.claims": "Claims",
    "nav.sources": "Sources",
    "nav.verify": "Verify",
    "nav.about": "About",
    "nav.privacy": "Privacy",
    "nav.switchLanguage": "Switch to Hindi",
    "nav.tagline": "Electoral Roll Transparency",

    // Banner & Disclaimers
    "banner.demo": "⚠ DEMONSTRATION MODE — All data shown is synthetic and fictional",
    "disclaimer.independence": "ElectraLens is an independent public-interest civic technology project. Not affiliated with, sponsored by, or endorsed by the Election Commission of India. All demonstration data is synthetic.",
    "footer.methodology": "Methodology v1.0.0 · Synthetic dataset",

    // Hero Section
    "hero.kicker": "THE VERIFIABLE CIVIC INTELLIGENCE LAYER",
    "hero.headline1": "Every roll.",
    "hero.headline2": "One verifiable record.",
    "hero.subhead": "Give every electoral roll snapshot a verifiable public record. Examine additions and deletions, inspect statistical evidence, detect unusual anomalies, and independently verify publication integrity through one connected civic platform.",
    "hero.cta.explore": "Explore the live data",
    "hero.cta.verify": "Verify a publication",
    "hero.proof.publicData": "Public aggregate data",
    "hero.proof.openMethod": "Open methodology",
    "hero.proof.privateIdentities": "Private identities",

    // Roll Passport Card
    "passport.kicker": "ROLL PASSPORT",
    "passport.anchor": "VERIFIED ANCHOR",
    "passport.revision": "SYNTHETIC REVISION PAIR",
    "passport.pair": "Q1 Draft → Q2 Final Roll",
    "passport.constituency": "Constituency: Vidyanagar Assembly (SYN-VID-01)",
    "passport.added": "Added",
    "passport.deleted": "Deleted",
    "passport.netShift": "Net Shift",
    "passport.eventChip": "event #03 · aggregate manifest",
    "passport.inspect": "inspect",

    // Section 2: Platform
    "platform.kicker": "REVISION MATRIX & PROVENANCE",
    "platform.title": "Revisions and audit trails on the same record.",
    "platform.desc": "The roll comparison proves what changed and where it shifted. The cryptographic manifest proves the numbers haven't moved. Because both read from one public record, researchers and citizens always inspect the same source of truth.",

    // Verification
    "verify.badge": "CRYPTOGRAPHIC VERIFIER · RFC 8785",
    "verify.title": "Publication Integrity Verification",
    "verify.subhead": "ElectraLens uses deterministic cryptographic commitments. Verify that the published analysis report and underlying aggregate statistical dataset match the published manifest without trusting any central server.",
    "verify.recompute": "Re-verify Hashes",
    "verify.computing": "Computing cryptographic hashes in browser...",
    "verify.reportHash": "Analysis Report Document Hash (SHA-256)",
    "verify.aggregateHash": "Aggregate Statistical Matrix Hash (SHA-256)",
    "verify.manifestHash": "Manifest Composite Commitment Hash",
    "verify.onChain": "On-Chain Registry Anchor (Mainnet RPC)",
    "verify.matches": "Matches",
    "verify.mismatch": "Mismatch",
    "verify.verified": "Verified",

    // Common Buttons
    "btn.verify": "Verify",
    "btn.explore": "Explore",
    "btn.inspect": "Inspect",
    "btn.print": "Print Record",
    "btn.back": "Back",

    // Section 6: Observer Verification & Mockup
    "section6.kicker": "CITIZEN & OBSERVER VERIFICATION",
    "section6.title": "One scan. No app. An honest answer.",
    "section6.desc": "Scanning a publication or polling-station code opens a public verification page in any browser. It only shows verified, mathematically aggregated, non-sensitive evidence.",
    "section6.item1": "Mathematically confirmed document integrity via SHA-256",
    "section6.item2": "Verified baseline comparison window & release timestamps",
    "section6.item3": "Strict identity protection: zero private citizen records exposed",
    "section6.verifiedStatus": "Publication Verified",
    "section6.viewAudit": "View Full Verification Audit",

    // Compare Workspace
    "compare.kicker": "REVISION COMPARISON WORKSPACE",
    "compare.title": "Examine the roll delta.",
    "compare.subhead": "Examine additions, deletions, and corrections across two snapshots of the electoral roll. Filter by administrative hierarchy and inspect statistical divergence on one verifiable canvas.",
    "compare.baseline": "Baseline Dataset (T₀)",
    "compare.target": "Target Dataset (T₁)",
    "compare.reset": "Reset to Primary Pair",
    "compare.additions": "Additions",
    "compare.deletions": "Deletions",
    "compare.corrections": "Corrections",
    "compare.netShift": "Net Change",
    "compare.searchPlaceholder": "Filter by constituency or code...",
    "compare.allLevels": "All Levels",
  },
  hi: {
    // Navigation
    "nav.home": "मुखपृष्ठ",
    "nav.compare": "तुलना करें",
    "nav.findings": "निष्कर्ष",
    "nav.methodology": "कार्यप्रणाली",
    "nav.claims": "दावे जांचें",
    "nav.sources": "डेटा स्रोत",
    "nav.verify": "सत्यापन",
    "nav.about": "परिचय",
    "nav.privacy": "गोपनीयता",
    "nav.switchLanguage": "Switch to English",
    "nav.tagline": "मतदाता सूची पारदर्शिता",

    // Banner & Disclaimers
    "banner.demo": "⚠ प्रदर्शन मोड — प्रदर्शित सभी डेटा सिंथेटिक और काल्पनिक है",
    "disclaimer.independence": "इलेक्ट्रालेंस एक स्वतंत्र जनहित नागरिक प्रौद्योगिकी परियोजना है। यह भारत के चुनाव आयोग से संबद्ध, प्रायोजित या समर्थित नहीं है। सभी प्रदर्शन डेटा सिंथेटिक है।",
    "footer.methodology": "कार्यप्रणाली v1.0.0 · सिंथेटिक डेटासेट",

    // Hero Section
    "hero.kicker": "सत्यापन योग्य नागरिक सूचना प्रणाली",
    "hero.headline1": "प्रत्येक सूची।",
    "hero.headline2": "एक सत्यापन योग्य रिकॉर्ड।",
    "hero.subhead": "प्रत्येक मतदाता सूची स्नैपशॉट को एक सत्यापन योग्य सार्वजनिक रिकॉर्ड दें। जोड़े और हटाए गए नामों की जांच करें, सांख्यिकीय साक्ष्यों का निरीक्षण करें, असामान्य विसंगतियों का पता लगाएं, और प्रकाशन अखंडता को स्वतंत्र रूप से सत्यापित करें।",
    "hero.cta.explore": "लाइव डेटा का अन्वेषण करें",
    "hero.cta.verify": "प्रकाशन सत्यापित करें",
    "hero.proof.publicData": "सार्वजनिक समग्र डेटा",
    "hero.proof.openMethod": "खुली कार्यप्रणाली",
    "hero.proof.privateIdentities": "निजी पहचान सुरक्षित",

    // Roll Passport Card
    "passport.kicker": "रोल पासपोर्ट",
    "passport.anchor": "सत्यापित एंकर",
    "passport.revision": "सिंथेटिक संशोधन युग्म",
    "passport.pair": "Q1 ड्राफ्ट → Q2 अंतिम सूची",
    "passport.constituency": "निर्वाचन क्षेत्र: विद्यानगर विधानसभा (SYN-VID-01)",
    "passport.added": "जोड़े गए",
    "passport.deleted": "हटाए गए",
    "passport.netShift": "शुद्ध बदलाव",
    "passport.eventChip": "इवेंट #03 · समग्र घोषणापत्र",
    "passport.inspect": "निरीक्षण",

    // Section 2: Platform
    "platform.kicker": "संशोधन मैट्रिक्स और स्रोत इतिहास",
    "platform.title": "एक ही रिकॉर्ड पर संशोधन और ऑडिट ट्रेल।",
    "platform.desc": "मतदाता सूची तुलना यह सिद्ध करती है कि क्या बदला और कहां स्थानांतरित हुआ। क्रिप्टोग्राफिक घोषणापत्र यह सिद्ध करता है कि आंकड़े बदले नहीं गए हैं।",

    // Verification
    "verify.badge": "क्रिप्टोग्राफिक सत्यापनकर्ता · RFC 8785",
    "verify.title": "प्रकाशन अखंडता सत्यापन",
    "verify.subhead": "इलेक्ट्रालेंस नियतात्मक क्रिप्टोग्राफिक प्रतिबद्धताओं का उपयोग करता है। पुष्टि करें कि प्रकाशित विश्लेषण रिपोर्ट और समग्र सांख्यिकीय डेटासेट घोषणापत्र से मेल खाते हैं।",
    "verify.recompute": "हैश पुनः जांचें",
    "verify.computing": "ब्राउज़र में क्रिप्टोग्राफिक हैश की गणना की जा रही है...",
    "verify.reportHash": "विश्लेषण रिपोर्ट दस्तावेज़ हैश (SHA-256)",
    "verify.aggregateHash": "समग्र सांख्यिकीय मैट्रिक्स हैश (SHA-256)",
    "verify.manifestHash": "घोषणापत्र समग्र प्रतिबद्धता हैश",
    "verify.onChain": "ऑन-चेन रजिस्ट्री एंकर (मेननेट आरपीसी)",
    "verify.matches": "सत्यापित (मेल खाता है)",
    "verify.mismatch": "बेमेल (परिवर्तित)",
    "verify.verified": "सत्यापित",

    // Common Buttons
    "btn.verify": "सत्यापित करें",
    "btn.explore": "अन्वेषण करें",
    "btn.inspect": "निरीक्षण करें",
    "btn.print": "रिकॉर्ड प्रिंट करें",
    "btn.back": "वापस",

    // Section 6: Observer Verification & Mockup
    "section6.kicker": "नागरिक और पर्यवेक्षक सत्यापन",
    "section6.title": "एक स्कैन। कोई ऐप नहीं। एक सच्चा उत्तर।",
    "section6.desc": "प्रकाशन या मतदान केंद्र कोड को स्कैन करने पर किसी भी ब्राउज़र में एक सार्वजनिक सत्यापन पृष्ठ खुलता है। यह केवल सत्यापित, गणितीय रूप से संकलित और गैर-संवेदनशील साक्ष्य दिखाता है।",
    "section6.item1": "SHA-256 के माध्यम से गणितीय रूप से सत्यापित दस्तावेज़ अखंडता",
    "section6.item2": "सत्यापित आधारभूत तुलना विंडो और जारी करने का समय",
    "section6.item3": "कड़ी पहचान सुरक्षा: शून्य निजी नागरिक रिकॉर्ड उजागर",
    "section6.verifiedStatus": "प्रकाशन सत्यापित",
    "section6.viewAudit": "पूर्ण सत्यापन ऑडिट देखें",

    // Compare Workspace
    "compare.kicker": "संशोधन तुलना कार्यक्षेत्र",
    "compare.title": "मतदाता सूची डेल्टा की जांच करें।",
    "compare.subhead": "मतदाता सूची के दो स्नैपशॉट में जोड़े, हटाए और सुधारे गए रिकॉर्ड्स की जांच करें। प्रशासनिक पदानुक्रम द्वारा फ़िल्टर करें और एक सत्यापन योग्य कैनवास पर सांख्यिकीय विचलन का निरीक्षण करें।",
    "compare.baseline": "आधारभूत डेटासेट (T₀)",
    "compare.target": "लक्षित डेटासेट (T₁)",
    "compare.reset": "प्राथमिक युग्म पर रीसेट करें",
    "compare.additions": "जोड़े गए",
    "compare.deletions": "हटाए गए",
    "compare.corrections": "सुधार",
    "compare.netShift": "शुद्ध बदलाव",
    "compare.searchPlaceholder": "निर्वाचन क्षेत्र या कोड द्वारा फ़िल्टर करें...",
    "compare.allLevels": "सभी स्तर",
  },
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  toggleLocale: () => {},
  t: (key, fallback) => fallback || key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("electralens_locale");
      if (saved === "hi" || saved === "en") {
        setLocaleState(saved);
      }
    } catch {
      // localStorage unavailable or restricted
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("electralens_locale", newLocale);
      document.documentElement.lang = newLocale;
    } catch {
      // ignore
    }
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "hi" : "en");
  };

  const t = (key: string, fallback?: string): string => {
    const dict = translations[locale];
    if (dict && dict[key]) {
      return dict[key];
    }
    const fallbackDict = translations["en"];
    if (fallbackDict && fallbackDict[key]) {
      return fallbackDict[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
