export interface AIAnalysisResult {
    isValid: boolean;
    rejectionReason?: string;
    category: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    estimatedCostMin: number;
    estimatedCostMax: number;
}
export declare const analyzeInfrastructureImage: (imageUrls: string[], userDescription: string, userCategory: string) => Promise<AIAnalysisResult>;
//# sourceMappingURL=ai.service.d.ts.map