/**
 * Zeigt den Ladecursor, bis alle laufenden Aktionen abgeschlossen sind.
 */
class LoadingCursor {
    static pending = 0;

    /**
     * Markiert den Beginn einer Aktion.
     */
    static start() {
        LoadingCursor.pending++;
        document.body.classList.add("loading");
    }

    /**
     * Entfernt den Ladecursor nach der letzten laufenden Aktion.
     */
    static stop() {
        LoadingCursor.pending--;
        if (LoadingCursor.pending === 0) {
            document.body.classList.remove("loading");
        }
    }
}
