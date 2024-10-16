export type SwiftDetails = {
    bank: string;
    country: string;
    location: string;
    branch: string | null;
};

export type BankData = {
    id: string;
    name: string;
    icon: string;
    city: string;
    address: string;
    branch: string;
    swift: {
        codes: string[];
        details: SwiftDetails;
    };
};
