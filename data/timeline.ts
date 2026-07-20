/* =====================================================================
   HELMUT — EIN LEBEN ZWISCHEN DEN ZEITEN
   ---------------------------------------------------------------------
   Alle Inhalte der Website leben in DIESER Datei.

   • Texte ändern:   einfach die Strings in `body` bearbeiten.
                     Jeder Eintrag im Array = ein Absatz.
   • Bilder setzen:  Datei nach  public/bilder/  legen und beim Kapitel
                     `image.src` eintragen, z. B. src: "/bilder/taufe.jpg"
   • Zitate:         optionales Feld `quote` pro Kapitel.

   Die Kapiteltexte wurden aus den Lebenserinnerungen von Helmut Ortner
   übernommen (Fassung „GESAMT überarbeitet“) und behutsam gekürzt.
   Markierung:  // TEXT: aus Buch – hier kürzen/ergänzen nach Wunsch
   ===================================================================== */

export type PlaceId =
  | "suedtirol"
  | "wien"
  | "drosendorf"
  | "stuetzenhofen"
  | "enns"
  | "hall";

export interface Place {
  id: PlaceId;
  /** Name unter der Karte, z. B. „Wien“ */
  name: string;
  /** Zusatzzeile unter dem Namen */
  region?: string;
  /** Position auf der SVG-Karte (viewBox 440 × 330) */
  x: number;
  y: number;
  /** Feinjustierung des Kartenlabels */
  labelDx?: number;
  labelDy?: number;
  labelAnchor?: "start" | "middle" | "end";
}

/** Besondere Karten-Momente einzelner Kapitel */
export type MapExtra =
  | "guben" // gestrichelte Linie nach Norden, über den Kartenrand hinaus
  | "abschied-sued" // der Transportzug der Mutter fährt nach Südtirol
  | "briefe-sued" // die Briefe an die Mutter – die Linie verliert sich
  | "radtouren"; // kleine Bögen um Wien: die ersten weiten Fahrten

export interface ChapterImage {
  /** Bildpfad, z. B. "/bilder/feldpost-1945.jpg" — leer lassen = Platzhalter */
  src?: string;
  alt: string;
  caption?: string;
  kind?: "foto" | "feldpost" | "dokument";
  /** Seitenverhältnis des Rahmens, z. B. "4/3" oder "3/2" */
  aspect?: string;
}

export interface Chapter {
  id: string;
  chapter: number;
  /** Anzeige, z. B. „1944/45“ */
  year: string;
  /** Zahl für den mitlaufenden Jahreszähler */
  yearValue: number;
  title: string;
  /** kleine Ortszeile über dem Titel */
  kicker?: string;
  place: PlaceId;
  /** Zwischenstationen für die Reiselinie auf der Karte */
  route?: PlaceId[];
  mapExtra?: MapExtra;
  body: string[];
  quote?: { text: string; source?: string };
  image?: ChapterImage;
}

/* ------------------------------------------------------------------ */
/*  Orte der Karte (stilisiertes Mitteleuropa, viewBox 440 × 330)      */
/* ------------------------------------------------------------------ */

export const PLACES: Record<PlaceId, Place> = {
  suedtirol: {
    id: "suedtirol",
    name: "Meran & Lana",
    region: "Südtirol",
    x: 72,
    y: 266,
    labelDx: 8,
    labelDy: 14,
    labelAnchor: "start",
  },
  hall: {
    id: "hall",
    name: "Solbad Hall",
    region: "Tirol",
    x: 90,
    y: 206,
    labelDx: -8,
    labelDy: -8,
    labelAnchor: "end",
  },
  wien: {
    id: "wien",
    name: "Wien",
    region: "Praterstraße · Lindengasse · Zentagasse",
    x: 372,
    y: 118,
    labelDx: -10,
    labelDy: 16,
    labelAnchor: "end",
  },
  stuetzenhofen: {
    id: "stuetzenhofen",
    name: "Stützenhofen",
    region: "Weinviertel, an der Grenze",
    x: 383,
    y: 62,
    labelDx: -8,
    labelDy: -8,
    labelAnchor: "end",
  },
  drosendorf: {
    id: "drosendorf",
    name: "Drosendorf",
    region: "Waldviertel, an der Thaya",
    x: 322,
    y: 54,
    labelDx: -8,
    labelDy: -6,
    labelAnchor: "end",
  },
  enns: {
    id: "enns",
    name: "Enns",
    region: "Demarkationslinie",
    x: 267,
    y: 118,
    labelDx: 0,
    labelDy: 18,
    labelAnchor: "middle",
  },
};

/* ------------------------------------------------------------------ */
/*  Intro & Ausklang                                                   */
/* ------------------------------------------------------------------ */

export const HERO = {
  overline: "Lebenserinnerungen",
  title: "Helmut",
  subtitle: "Ein Leben zwischen den Zeiten",
  lede: "Geboren am 19. Februar 1942 in Wien. Eine Kindheit zwischen Krieg und Frieden — erzählt in seinen eigenen Worten, entlang der Jahre und der Orte.",
  scrollHint: "Scrollen Sie langsam. Die Jahre gehen mit.",
  /** Startpunkt des Jahreszählers: 1911, das Geburtsjahr des Vaters */
  yearValue: 1911,
};

export const OUTRO = {
  yearValue: 1955,
  title: "Und dann: Freiheit.",
  // TEXT: Widmungs-/Schlusswort der Familie hier einsetzen
  dedication: [
    "Diese Seite erzählt die Kindheitsjahre unseres Großvaters Helmut Ortner, so wie er sie selbst aufgeschrieben hat.",
    "Für ihn — und für alle, die nach ihm kommen.",
  ],
  closing: "Nach den Lebenserinnerungen von Helmut Ortner · Wien 1942–1955",
};

/* ------------------------------------------------------------------ */
/*  Die 14 Stationen                                                   */
/* ------------------------------------------------------------------ */

export const CHAPTERS: Chapter[] = [
  {
    id: "option",
    chapter: 1,
    year: "1911–1939",
    yearValue: 1939,
    title: "Die Option",
    kicker: "Südtirol → Wien",
    place: "suedtirol",
    // TEXT: aus Buch – hier kürzen/ergänzen nach Wunsch
    body: [
      "Den betroffenen Menschen blieb nur eine radikale und schmerzhafte Entscheidung, die als „Die Option“ in die Geschichte einging: Entweder man akzeptierte die rigorose Italianisierung und passte sich an, oder man wanderte aus – hinein in das Deutsche Reich, mitten in eine ungewisse Zukunft.",
      "Vater Peter Ortner erblickte am 19. Mai 1911 in Innsbruck das Licht der Welt. Als viertes Kind von Alois und Anna Ortner wuchs er mit seinen drei Geschwistern auf. Die Heimat der Familie war Lana in Südtirol. Das Leben der Familie änderte sich tiefgreifend, als die historische Entscheidung der „Option“ anstand und sich die Ortners für die Auswanderung aus Südtirol entschieden.",
      "Im Jahr 1939 folgte schließlich der große Umzug. Die Großeltern von Helmut bezogen eine Wohnung im zweiten Wiener Gemeindebezirk. In der Praterstraße 66 bauten sie sich gemeinsam mit ihren Söhnen Alois, Josef und Peter ein neues Leben auf.",
      "Regina, die Mutter, wurde am 24. April 1909 im Südtiroler Göflan, in der Pfarre Schlanders, geboren. In Wien fand sie über einen Südtiroler Heimatverein Anschluss unter Gleichgesinnten – und lernte dort ihren Landsmann Peter kennen. Die beiden verliebten sich ineinander und krönten ihre Liebe am 1. März 1941 mit der Hochzeit in Wien.",
      "In der fremden Großstadt bezog die Familie Wohnungen, die ihnen durch die sogenannte Arisierung zugeteilt worden waren. Ein fader Beigeschmack haftete diesem Neuanfang an, und so klammerten sich die Ortners an eine leise Hoffnung: Die Vorbewohner, so redeten sie sich ein, gehörten bestimmt zu jenen Glücklichen, die Nazi-Deutschland noch rechtzeitig verlassen konnten.",
    ],
    image: {
      alt: "Südtirol vor der Abreise",
      caption: "Lana in Südtirol, die alte Heimat der Familie Ortner. — Platz für ein Familienfoto.",
      kind: "foto",
    },
  },
  {
    id: "geburt",
    chapter: 2,
    year: "1942",
    yearValue: 1942,
    title: "Geburt in Wien",
    kicker: "Wien, Praterstraße 66",
    place: "wien",
    // TEXT: aus Buch – hier kürzen/ergänzen nach Wunsch
    body: [
      "Ich erblickte das Licht der Welt in einer furchtbaren Zeit: mitten im Krieg, im Fieber des Jahres 1942, wurde ich geboren. Als neuer Mitbewohner zog ich in die Wiener Praterstraße ein, wo ich fortan gemeinsam mit meiner Mutter, meinen Großeltern und meinen Onkeln lebte.",
      "Der Krieg bestimmte von Anfang an unser Familienschicksal. Meine Onkel Luis und Sepp wurden zum Wehrdienst verpflichtet und an die Fronten in Dänemark und Italien geschickt.",
      "Die Familie Ortner war im katholischen Glauben verwurzelt. So wurde ich am 24. Februar in der Johann-Nepomuk-Kirche in der Praterstraße getauft. Dieser Tag ging trotz der düsteren Zeiten als ein heiterer Moment in unsere Familiengeschichte ein: Meine elfjährige Cousine Marianne und mein achtjähriger Cousin Karl bekamen während der Zeremonie einen derartigen Lachkrampf, dass sie sich kaum beruhigen konnten.",
    ],
    image: {
      alt: "Taufe in der Johann-Nepomuk-Kirche",
      caption: "19. Februar 1942: Helmut kommt in Wien zur Welt. — Platz für ein Foto der Taufe oder der Praterstraße.",
      kind: "foto",
    },
  },
  {
    id: "drosendorf",
    chapter: 3,
    year: "1942–1944",
    yearValue: 1943,
    title: "Der Vater an der Grenze",
    kicker: "Drosendorf an der Thaya",
    place: "drosendorf",
    // TEXT: aus Buch – hier kürzen/ergänzen nach Wunsch
    body: [
      "Meinem Vater blieb das Schicksal der Front vorerst erspart. Bei seiner Musterung stellten die Ärzte einen Herzfehler fest, weshalb er nicht an die Front musste. Stattdessen zog man ihn als Aufseher für Kriegsgefangene nach Drosendorf an der tschechischen Grenze ein.",
      "Ein normales, behütetes Familienleben gab es für mich damals nicht. Mein Vater verbrachte die meiste Zeit im Waldviertel, um dort russische Gefangene zu bewachen. Durch diesen vergleichsweise sicheren Einsatz kam er auch mit der einheimischen Bevölkerung in Drosendorf in Kontakt. Besonders eng war die Verbindung zur Bauernfamilie Ressl.",
      "Als mein Onkel Alois – den wir in der Familie Luis nannten – im Jahr 1943 Heimaturlaub bekam, besuchte er meinen Vater in Drosendorf. Bei dieser Gelegenheit lernte er die Familie Ressl und die hübsche Tochter Mitzi kennen. Es war Liebe auf den ersten Blick. Die beiden verliebten sich unsterblich ineinander – mein Cousin Rainer erblickte im Februar 1945 das Licht der Welt.",
    ],
  },
  {
    id: "ziegelwerk",
    chapter: 4,
    year: "1944/45",
    yearValue: 1944,
    title: "Kindheit im Ziegelwerk",
    kicker: "Stützenhofen, Weinviertel",
    place: "stuetzenhofen",
    quote: {
      text: "Was machen die kleinen Buben in der Wiese? Unbekümmert spielen die beiden Kameraden Helmut und Manfred miteinander.",
      source: "Aus der Einleitung der Lebenserinnerungen",
    },
    // TEXT: aus Buch – hier kürzen/ergänzen nach Wunsch
    body: [
      "Der erste schwere Luftangriff traf Wien am 10. September 1944 mit voller Härte. Die Bomben hinterließen verheerende Zerstörungen in der Innenstadt. Aus Sicherheitsgründen begann man zu dieser Zeit, Mütter mit Kleinkindern aus der gefährlichen Stadt abzusiedeln.",
      "So kam es, dass ich mein zweites und drittes Lebensjahr in einem Ziegelwerk verbrachte. Meine Mutter war dort beschäftigt, und während sie arbeitete, wurde ich tagsüber in einem Hort betreut. Diese prägende Zeit im niederösterreichischen Stützenhofen sollte für meine spätere Zukunft noch sehr entscheidend werden.",
      "Mein Spielgefährte dort war Manfred, der kleine Sohn von Anna Frei – einer Südtirolerin, die genau wie meine Mutter im Ziegelwerk schuftete. Die Väter waren nicht da, und die Mütter mussten den ganzen Tag hart arbeiten.",
    ],
    image: {
      alt: "Das Ziegelwerk in Stützenhofen",
      caption: "Stützenhofen 1944/45, rund 70 Kilometer von Wien, direkt an der Grenze. — Platz für ein Foto.",
      kind: "foto",
    },
  },
  {
    id: "scheidung",
    chapter: 5,
    year: "1944/45",
    yearValue: 1945,
    title: "Die Scheidung — und Margit",
    kicker: "Stützenhofen · Drosendorf",
    place: "stuetzenhofen",
    // TEXT: aus Buch – hier kürzen/ergänzen nach Wunsch
    body: [
      "Die Gegebenheiten trennten meine Eltern auch räumlich: Mein Vater lebte in Drosendorf, meine Mutter in Stützenhofen bei Drasenhofen. Bei einem der seltenen Treffen stand mein Vater plötzlich vor der unumstößlichen Tatsache, dass seine Frau ohne sein Zutun schwanger geworden war. Das Tischtuch zwischen den beiden war zerrissen, und am 3. November 1944 folgte die Scheidung. Gerichtlich wurde ich dabei meinem Vater zugesprochen.",
      "Trotz der fortschreitenden Schwangerschaft musste meine Mutter weiterhin schwer im Ziegelwerk arbeiten, während ich untertags im Hort versorgt wurde. Am 16. Jänner 1945 erblickte schließlich meine Halbschwester Margit das Licht der Welt.",
      "Für meine Mutter galt diese uneheliche Schwangerschaft als die größte Todsünde ihres Lebens. Aus Verzweiflung und inmitten der chaotischen Kriegswirren gab sie bei der Geburt dennoch meinen Vater als Erzeuger an. So wurde das Mädchen in der Pfarre Stützenhofen auf den Namen Margit Ortner getauft.",
    ],
  },
  {
    id: "vater",
    chapter: 6,
    year: "1945",
    yearValue: 1945,
    title: "Der Vater fällt",
    kicker: "Guben an der Neiße · 1. April 1945",
    place: "stuetzenhofen",
    mapExtra: "guben",
    // TEXT: aus Buch – hier kürzen/ergänzen nach Wunsch
    body: [
      "Im Februar 1945 wurde mein Vater, völlig ohne militärische Ausbildung, in den sinnlosen Kampf ums Vaterland an die Front abkommandiert. In seinem ersten Brief, datiert auf den 11. Februar 1945, war er noch der festen Überzeugung, dass er an die Ostsee nahe Dänemark zur Küstenbewachung geschickt werden könnte.",
      "In einem Schreiben vom 17. März 1945 aus Guben: Brutalität pur – und die Hoffnung auf den Pfennig seiner Eltern, der ihm als Glücksbringer beistehen sollte. In seinen letzten Briefen von der Front bat er seine Familie darum, dass ich in der Familie Ortner aufgezogen werden solle.",
      "Die traurige Gewissheit holte uns erst im Dezember 1945 ein. Anton Bezdĕkovský, ein Kamerad meines Vaters aus gemeinsamen Tagen im Waldviertel, suchte uns auf. Monatelang hatte er nicht den Mut aufgebracht, die schreckliche Nachricht zu überbringen. Nun erfuhren wir es: Mein Vater war bereits am 1. April 1945 gefallen. Während eines Häuserkampfes hatten ihn Granatsplitter am Kopf tödlich verletzt.",
    ],
    quote: {
      text: "Auch der Pfennig seiner Eltern, den er als Glücksbringer bei sich getragen hatte, hatte den Tod nicht verhindern können.",
    },
    image: {
      alt: "Feldpostbrief von Peter Ortner",
      caption: "Feldpost aus dem Frühjahr 1945. — Platz für das Faksimile eines Feldpostbriefs.",
      kind: "feldpost",
      aspect: "3/2",
    },
  },
  {
    id: "kriegsende",
    chapter: 7,
    year: "1945",
    yearValue: 1945,
    title: "Kriegsende",
    kicker: "Drosendorf → Wien, zu Fuß",
    place: "wien",
    route: ["drosendorf"],
    // TEXT: aus Buch – hier kürzen/ergänzen nach Wunsch
    body: [
      "Weil Wien immer wieder schweren Bombenangriffen ausgesetzt war, flohen die Großeltern schließlich aus der Stadt. Sie zogen zu ihrer Schwiegertochter Mitzi auf den Bauernhof nach Drosendorf, um dort das ersehnte Kriegsende abzuwarten. In den letzten Kriegstagen im April 1945 stand Opa früh morgens auf dem Hof, wie gewohnt mit dem Holzhacken beschäftigt. Plötzlich hörte das regelmäßige Schlagen auf. Oma blickte aus dem Küchenfenster – da sah sie ihn. Opa lag regungslos über dem Holzstock. Er war einem plötzlichen Herzinfarkt erlegen.",
      "Mitten im Zusammenbruch der letzten Kriegstage blieb Oma völlig auf sich allein gestellt zurück. Da es keinerlei Verkehrsverbindungen mehr gab, packte sie die wenigen Habseligkeiten in einen kleinen Koffer und machte sich auf den Weg. Es wurde ein beschwerlicher, dreitägiger Fußmarsch durch ein vom Krieg gezeichnetes Land. Unterwegs kreuzten russische Soldaten ihren Weg und nahmen ihr auch noch diese letzten Habseligkeiten ab.",
      "Als meine Großmutter endlich in Wien ankam, zog es sie sofort zur Praterstraße 66. Doch vor ihr lag nur ein Bild des Grauens: Das Haus war völlig ausgebombt, ein einziger Haufen Schutt. Fassungslos kniete sie sich nieder und begann, mit bloßen Händen in den Trümmern zu graben.",
      "Mitten in diesem Unglück gab es jedoch einen großen Hoffnungsschimmer: Die Wohnung im siebten Wiener Gemeindebezirk, in der Lindengasse 24, war wie durch ein Wunder unversehrt geblieben. Erleichtert zog meine Oma in das kleine Kabinett dieser Wohnung ein.",
    ],
    image: {
      alt: "Die zerstörte Praterstraße",
      caption: "Praterstraße 66 — ausgebombt. Die Lindengasse 24 wird zur Rettung. — Platz für ein Foto.",
      kind: "foto",
    },
  },
  {
    id: "abschied",
    chapter: 8,
    year: "1945",
    yearValue: 1946,
    title: "Abschied von der Mutter",
    kicker: "Wien, am Transportzug",
    place: "wien",
    mapExtra: "abschied-sued",
    // TEXT: aus Buch – hier kürzen/ergänzen nach Wunsch
    body: [
      "Zu dieser Zeit wurde das Ziegelwerk endgültig geschlossen. Ohne eine Perspektive vor Ort packte meine Mutter unsere wenigen Habseligkeiten. Gemeinsam mit Margit, mir und ihrer engen Freundin Anna Frei samt dem kleinen Manfred machte sie sich auf den Weg nach Wien.",
      "Oma schloss mich fest in ihre Arme, und die Erleichterung war ihr deutlich anzusehen. Mit mir erfüllte sich der ausdrückliche Wunsch ihres Sohnes Peter: Sein Kind sollte bei der Familie Ortner aufwachsen. Oma hätte ohne Zögern auch meine Mutter mit Margit bei sich aufgenommen, doch die Größe der kleinen Wohnung ließ das einfach nicht zu.",
      "Onkel Luis übernahm die Initiative und organisierte eine Möglichkeit, wie meine Mutter, Margit und Anna mit dem kleinen Manfred nach Südtirol gelangen konnten. Es dauerte nicht lange, da saßen sie auch schon in einem Transportzug Richtung Süden. Drei endlose Tage schleppte sich der Dampfzug durch das zerrüttete Land. Für mich bedeutete dieser Aufbruch den endgültigen Abschied von meiner leiblichen Mutter.",
    ],
    quote: {
      text: "Für sie hingegen brach eine Welt zusammen, als sie mich zurücklassen musste. Doch sie hatte keine andere Wahl.",
    },
  },
  {
    id: "nachkriegswien",
    chapter: 9,
    year: "1946/47",
    yearValue: 1946,
    title: "Nachkriegs-Wien",
    kicker: "Lindengasse 24, 7. Bezirk",
    place: "wien",
    // TEXT: aus Buch – hier kürzen/ergänzen nach Wunsch
    body: [
      "Der Alltag im Nachkriegsösterreich blieb entbehrungsreich. Zu essen gab es nie viel. Um mich zu stärken, musste ich regelmäßig Polenta mit Milch essen und den bitteren Lebertran schlucken.",
      "Nur wenige Häuser entfernt war unser Greißler – ein kleiner, enger Laden, wie es sie damals überall gab. Mehl, Zucker und Milch wurden in kleinen Mengen genau abgemessen und abgefüllt. Der Greißler führte für jede Familie ein eigenes Einkaufsbuch, in dem alle Besorgungen sorgfältig notiert wurden. Bezahlt wurde strikt einmal in der Woche, wenn der Lohn da war.",
      "Ein eigenes Badezimmer war purer Luxus, den kaum jemand besaß. Die morgendliche Wäsche fand in einer einfachen Waschschüssel statt, dem Lavoir, und das Wasser dafür war bitterkalt. Für die gründliche Körperreinigung gab es ein festes Ritual: Einmal in der Woche ging es ins Tröpferlbad in der Hermanngasse.",
      "Ein ganz bestimmtes Weihnachtsfest ist mir bis heute unauslöschlich in Erinnerung geblieben. In diesem Jahr sollte es tatsächlich Brathuhn geben – eine unvorstellbare Delikatesse. Von November bis zum Heiligen Abend wurde auf dem Dachboden über uns heimlich ein Huhn für das Weihnachtsfest gehalten und gemästet.",
      "Dann war es endlich so weit. Das lang ersehnte Brathuhn wurde feierlich zerlegt und aufgeteilt. Mir wurde stolz das Bürzel serviert. Karl schaute mich mit einem schelmischen Grinsen an und fragte: „Helmut, weißt du schon, was du bekommen hast?“ – „Ein Stück Hendl.“ – „Ja, aber das ist der Arsch.“",
      "Im selben Moment war es um meinen Appetit geschehen. Das edle Festmahl hatte plötzlich jeden Reiz für mich verloren. Karl stimmte ein schallendes Lachen an, fackelte nicht lange und sicherte sich hocherfreut meine Portion.",
    ],
    image: {
      alt: "Wien in den Nachkriegsjahren",
      caption: "Greißler, Tröpferlbad, Polenta und Lebertran — der Alltag der Nachkriegsjahre. — Platz für ein Foto.",
      kind: "foto",
    },
  },
  {
    id: "solbadhall",
    chapter: 10,
    year: "1948",
    yearValue: 1948,
    title: "Die Reise nach Solbad Hall",
    kicker: "Wien → Enns → Tirol",
    place: "hall",
    route: ["enns"],
    // TEXT: aus Buch – hier kürzen/ergänzen nach Wunsch
    body: [
      "Es war das Jahr 1948, ich war sechs Jahre alt, als ich ein Abenteuer erlebte, das sich für immer in mein Gedächtnis einbrennen sollte. Die Sehnsucht meiner Oma nach ihrem jüngsten Sohn Paul, der im fernen Tirol in Solbad Hall lebte, war stärker als jede Vernunft und jede Angst. Österreich war noch immer in vier Besatzungszonen aufgeteilt, und man warnte eindringlich vor jeder Reise, die nicht absolut notwendig war.",
      "Der Bahnhof war erfüllt vom Zischen und Fauchen der gewaltigen, dampfbetriebenen Lokomotive. Wir nahmen auf den harten, unbequemen Holzbänken Platz. Der spannendste und zugleich beängstigendste Moment erwartete uns an der Demarkationslinie in Enns – der streng bewachten Grenze zwischen der russischen und der amerikanischen Besatzungszone.",
      "Russische Besatzungssoldaten stiegen in die Waggons. Die Luft im Abteil war plötzlich schneidend kalt vor Anspannung. Niemand wagte zu sprechen. Mit ernsten Mienen kontrollierten sie penibel jeden einzelnen Identitätsausweis. Meine Oma saß kerzengerade da. Ich drückte mich an sie. Minuten vergingen wie Stunden. Schließlich bekamen wir unsere Ausweise zurück. Ein kaum merkliches Nicken des Soldaten erlöste uns – wir durften passieren.",
      "Nach einer endlos scheinenden, zehnstündigen Fahrt kamen wir endlich in Tirol an. Als wir in Solbad Hall ausstiegen, müde und mit schmerzenden Gliedern, lag uns Onkel Paul bereits in den Armen.",
    ],
    quote: {
      text: "Geblieben ist die Erinnerung an eine unvergessliche Reise und den unbändigen Mut meiner Großmutter.",
    },
  },
  {
    id: "schuljahre",
    chapter: 11,
    year: "1948–1951",
    yearValue: 1950,
    title: "Der kleine „Spion“ von der Stiftgasse",
    kicker: "Besetztes Wien · Zieglergasse & Stiftskaserne",
    place: "wien",
    route: ["enns"], // Rückreise aus Tirol — die Linie führt wieder über Enns
    // TEXT: aus Buch – hier kürzen/ergänzen nach Wunsch
    body: [
      "Im September 1948 begann für mich der Ernst des Lebens – meine Pflichtschuljahre in Wien. Die Stadt war von den Alliierten besetzt, der Schulalltag von purem Mangel geprägt. Ich schätzte mich glücklich, denn ich besaß ein Paar Schuhe. Oma hatte sie mir besorgt und sich dafür buchstäblich das Essen vom Munde abgespart. Ich war zwar ein dünner Bub – „zaundürr“ –, aber ich war zäh. Ein Segen war die Schulausspeisung: Sechsmal die Woche erhielten wir eine warme Mahlzeit.",
      "Wir Buben wetteiferten mit Heft und Bleistift, wer pro Tag mehr Autokennzeichen aufschreiben konnte. Es gab noch kaum Fahrzeuge auf den Straßen, und fast alle Kennzeichen waren Wiener. Nur in einer einzigen Straße, der Stiftgasse, bewegten sich so schöne Autos mit bunten Kennzeichen: Dort war der Stützpunkt der amerikanischen Alliierten. Und ich wollte mich mit diesen großartigen Kennzeichen von den anderen abheben.",
      "Eines Tages stand ich vor der Stiftskaserne, gegenüber der Ein- und Ausfahrt. Auf einmal fuhr ein besonderes Auto heraus. Am Steuer ein schwarzer Mann, am Nebensitz ein älterer Herr in Uniform mit sehr vielen Abzeichen. Sie fuhren schnurstracks auf mich zu. Der ältere Herr fragte in einem komischen Deutsch, was ich in mein Heft schriebe. Als ich ihm aus der Ferne das Heft zeigte, meinte er nur: „Get in the car.“",
      "Ich wollte auf dem schnellsten Weg nach Hause. Doch der große Mann konnte unheimlich schnell laufen. Also klammerte ich mich an der Türschnalle des nächsten Hauseingangs fest und schrie um Hilfe. Die Menschen gingen unbeeindruckt weiter. Der Mann suchte in seiner Hosentasche nach Süßigkeiten, um mich zu beruhigen – und schließlich ging ich mit. Er brachte mich zur Kaserne ins Wachzimmer, wo bereits der Offizier und ein Dolmetscher warteten.",
      "Sie befragten mich nach den Namen meiner Familie und warum ich vor der Kaserne die Kennzeichen aufschreibe. In der Hoffnung auf „Gnade“ sagte ich immer wieder: „Die Russen haben im Krieg meinen Vater erschossen.“ Nach einer Weile dürften sie kapiert haben, dass sie keinen „Spion“ in ihrem Wachzimmer festhielten, und ließen mich frei. Mein erstes Schulheft aber ging in amerikanischen Besitz über.",
      "Es war die Zeit des Kalten Krieges. Als siebenjährigem Bub war mir noch nicht bewusst, dass ich in diesem weltpolitischen Gefüge quasi schon als kleiner Agent mitmischte.",
    ],
    quote: {
      text: "„Get in the car.“",
      source: "Ein amerikanischer Offizier vor der Stiftskaserne",
    },
    image: {
      alt: "Vor der Stiftskaserne in Wien",
      caption: "Die Stiftgasse, 200 Meter von zu Hause: bunte Kennzeichen, amerikanische Autos. — Platz für ein Foto.",
      kind: "foto",
    },
  },
  {
    id: "oma",
    chapter: 12,
    year: "1952",
    yearValue: 1952,
    title: "„Passt mir auf den Helmut auf“",
    kicker: "Wien, Zentagasse",
    place: "wien",
    // TEXT: aus Buch – hier kürzen/ergänzen nach Wunsch
    body: [
      "Um die beengte Wohnsituation in der Lindengasse zu entschärfen, siedelten Oma und ich in die Zentagasse im vierten Bezirk um. Die Wohnung war für damalige Verhältnisse modern, denn wir hatten fließendes Wasser und ein eigenes Bad. Ein Highlight jener Jahre: ein gebrauchter Tretroller aus Holz. Für mich bedeutete er ein enormes Stück Freiheit – ich war fortan als flinker „Kurier“ zwischen unseren familiären Wohnorten unterwegs.",
      "In jener Zeit wurde meine Großmutter zunehmend kränklicher. Bereits im vergangenen Winter hatte sie einen leichten Schlaganfall erlitten, von dem sie sich nicht mehr vollständig erholen konnte.",
      "An einem schicksalhaften Tag im Herbst 1952 war ich mit Oma allein zu Hause. Ganz plötzlich wurde ihr speiübel, und im nächsten Moment brach sie zusammen. In meiner Not mobilisierte ich alle Kräfte und schaffte es, sie in ihr Bett zu tragen. Voller Panik rannte ich zu den Nachbarn, um Alarm zu schlagen. Die Rettung traf kurz darauf ein, doch im Krankenhaus verstarb sie an den Folgen dieses zweiten, schweren Schlaganfalls.",
      "Das Schicksal traf mich hart. Ich wusste nun als Zehnjähriger: Du musst dich durchschlagen und so schnell wie möglich selbstständig werden.",
    ],
    quote: {
      text: "Passt mir auf den Helmut auf.",
      source: "Omas letzte Worte, am Sterbebett zu Tante Anna",
    },
    image: {
      alt: "Die Großmutter",
      caption: "Sie hatte ihn durch die schwersten Jahre getragen. — Platz für ein Foto der Oma.",
      kind: "foto",
      aspect: "3/4",
    },
  },
  {
    id: "konsulat",
    chapter: 13,
    year: "1952/53",
    yearValue: 1953,
    title: "Das Konsulat — ein Kind zwischen zwei Staaten",
    kicker: "Wien · Meran",
    place: "wien",
    mapExtra: "briefe-sued",
    // TEXT: aus Buch – hier kürzen/ergänzen nach Wunsch
    body: [
      "Damals wohnte meine leibliche Mutter mit meiner Halbschwester Margit in einer kleinen Mietwohnung direkt oberhalb des Meraner Doms. Der Tod meiner Großmutter war für sie der Anlass, mich nach sieben Jahren zu sich nach Meran zu holen.",
      "Sobald ich in der Volksschule die ersten Buchstaben setzte, hatte ich begonnen zu schreiben. Jedes Wort war für meine Mutter bestimmt. Ich zog mit einem Bleistift exakte Linien auf das Papier, um die Schrift gerade zu halten. Erst dann setzte ich den Füller an. Wenn die Tinte getrocknet war, radierte ich die Hilfslinien vorsichtig wieder weg. Es sollte perfekt sein. Ein makelloses Zeichen meiner Zuneigung.",
      "Erst viel später erfuhr ich: Meine Mutter hatte niemals auch nur einen einzigen dieser Briefe erhalten. Hatten meine Onkel die Post abgefangen? Als Kind habe ich diese Stille nie hinterfragt. Heute schmerzt das Rätsel dieser verlorenen Worte.",
      "Weil mein Vater im Zuge der Option die deutsche Staatsbürgerschaft angenommen hatte, galt ich nach 1945 in Österreich rechtlich als Ausländer, ja als staatenlos. Ein Kind, geboren in Wien, aufgewachsen in Wien, dessen Vater für dieses Land gefallen war – und doch auf dem Papier ohne Land. So wurde ich als zehnjähriger Bub zu einer offiziellen Befragung ins italienische Konsulat vorgeladen. Die Angst, die mich damals quälte, war unbeschreiblich: Ich fürchtete, in ein völlig fremdes Land abgeschoben zu werden.",
      "Ein glücklicher Zufall rettete mich. Am 2. Juli 1952 beschloss der österreichische Nationalrat das Minderheiten-Staatsbürgerschaftsgesetz. In dem Moment, als das Gesetz in Kraft trat, wurde ich über Nacht österreichischer Staatsbürger. Damit verlor das italienische Konsulat augenblicklich jegliche Rechtsgrundlage, mich weiter zu belangen oder gar abzuschieben.",
    ],
    quote: {
      text: "Doch eine Antwort blieb aus. Wochen, Monate, Jahre lang.",
    },
    image: {
      alt: "Ein Brief an die Mutter",
      caption: "Mit Bleistiftlinien vorgezeichnet, mit dem Füller geschrieben, die Hilfslinien wegradiert. — Platz für ein Dokument.",
      kind: "dokument",
      aspect: "3/2",
    },
  },
  {
    id: "freiheit",
    chapter: 14,
    year: "1954/55",
    yearValue: 1954,
    title: "Das Fahrrad aus Kanada",
    kicker: "Wien — und hinaus ins Land",
    place: "wien",
    mapExtra: "radtouren",
    // TEXT: aus Buch – hier kürzen/ergänzen nach Wunsch
    body: [
      "Weihnachten. Aus heutiger Sicht bekam ich das schönste Weihnachtsgeschenk meines Lebens: ein Fahrrad. Geschenkt hat es mir Karl. Er war bereits das zweite Jahr weg und arbeitete als Elektriker in Kanada und Alaska. Karl schickte das Geld, um mir diese für mich wahnsinnige Freude zu bereiten.",
      "Nun begann für mich sehr viel „Freiheit“. Ich war in meiner Freizeit viel mit dem Fahrrad unterwegs. Vor allem unternahm ich mit einem Schulkollegen, Ferry, schon am Sonntag weite Touren nach Niederösterreich und ins Burgenland.",
      "Das Leben wurde spürbar besser in den 50er-Jahren. 1955 bekamen Marianne und ihr Mann ihre erste eigene Wohnung, und bei uns zog Rudolf Hamerl ein, ein Freund meiner Tante Anna. So hatte ich einen weiteren Onkel – den Onkel Rudi.",
    ],
    quote: {
      text: "Ich fuhr noch am Weihnachtsabend voller Freude mehrmals die Lindengasse auf und ab.",
    },
    image: {
      alt: "Helmut mit dem Fahrrad",
      caption: "Das Fahrrad von Karl aus Kanada — der Anfang der Freiheit. — Platz für ein Foto.",
      kind: "foto",
    },
  },
];
