/**
 * Clinical Write Safety Gate
 * CLINICAL_WRITES_ENABLED must remain false.
 */

export const CLINICAL_WRITES_ENABLED = false as const;

export class ClinicalWriteDisabledError extends Error {
  constructor(message = 'Clinical writes are strictly disabled in this evaluation workspace.') {
    super(message);
    this.name = 'ClinicalWriteDisabledError';
  }
}

export function assertClinicalWritesAllowed(): void {
  if (!CLINICAL_WRITES_ENABLED) {
    throw new ClinicalWriteDisabledError();
  }
}
