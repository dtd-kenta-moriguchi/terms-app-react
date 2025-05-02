export class TsvParser {
  static parse(tsvContent: string): Record<string, string> {
    const terms: Record<string, string> = {};
    const lines = tsvContent.split("\n");

    for (const line of lines) {
      if (!line.trim()) continue;

      const [term, description] = line.split("\t");
      if (term && description) {
        terms[term.toLowerCase()] = description;
      }
    }

    return terms;
  }
}
