import { GetLeadPayload } from "./lead.type";
import { CombineTypes } from "./utility/combine.utility";

export type Qualification =
  | {
      id: string;

      leadId: string;
      budget: null;
      timeline: null;
      levelOfInterest: null;
      spokenLanguage: null;
      customerType: null;
      finance: null;
      buyerType: null;
      nationalityId: null;
      userId: string;

      createdAt: string;
      updatedAt: string;
      qualifiedAt: null;
    }
  | {
      id: string;

      leadId: string;
      budget: number;
      timeline: number;
      levelOfInterest: number;
      spokenLanguage: string;
      customerType: string;
      finance: string | null;
      buyerType: string | null;
      nationalityId: string;
      userId: string;

      createdAt: string;
      updatedAt: string;
      qualifiedAt: string;
    };

type Includes = {
  lead: GetLeadPayload<{ listing: true }>;
};

export type GetQualificationPayload<
  T extends Partial<Record<keyof Includes, boolean>>
> = Qualification & CombineTypes<Includes, T>;
