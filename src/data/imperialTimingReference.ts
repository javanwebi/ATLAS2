import reference from './imperialTimingReference.json';

export interface DesignationCheck {
  status: 'listed-reference-length' | 'unlisted-reference-length' | 'reference-conflict';
  designation: string;
  sourceUrl: string;
  pdfPage?: number;
  lengthMm?: number;
  teeth?: number;
  identityVerified: false;
}

/** Table lookup, NOT a formula that silently mistakes rounded codes for lengths.
 * Source lengths do not establish brand, material or identity of stocked items.
 */
export function checkImperialDesignation(number: string, profile: string): DesignationCheck {
  const designation = `${number}${profile}`;
  const rows: Record<string, {lengthMm:number;teeth:number;pdfPage:number;sourceUrl?:string}> = reference.lengths;
  const conflicts: Record<string, {pdfPage:number}> = reference.conflicts;
  const row = rows[designation];
  if (row) return {status:'listed-reference-length',designation,sourceUrl:reference.sourceUrl,...row,identityVerified:false};
  if (conflicts[designation]) return {status:'reference-conflict',designation,sourceUrl:reference.sourceUrl,pdfPage:conflicts[designation].pdfPage,identityVerified:false};
  return {status:'unlisted-reference-length',designation,sourceUrl:reference.sourceUrl,identityVerified:false};
}
