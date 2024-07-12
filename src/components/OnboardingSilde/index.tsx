"use client";

import { useEffect, useState } from "react";
import AppDownloadScreen from "./AppDownloadScreen";
import TextScreen from "./TextScreen";
import styles from "./styles.module.scss";
import DropdownScreen from "./DropdownScreen";
import GridScreen from "./GridScreen";
import NewsletterScreen from "./NewsletterScreen";

const testJSON = [
    {
    name: "Screen6",
    key: "screen6",
    displayOrder: 2,
    version: 1,
    templateId: "DropDown",
    boldTitle: "Your Expectations from ETPrime",
    editShowTitle: "",
    desc: "",
    questions: [
    {
    key: "expectation",
    question: "What do you hope to get out of ETPrime?",
    type: "DropDown",
    showQuestion: true,
    options: [
    {
    name: "Select",
    key: "select",
    value: "Select",
    selected: false
    },
    {
    name: "Support in career progression",
    key: "supportInCareerProgression",
    value: "Support in career progression",
    selected: false
    },
    {
    name: "Make better financial/investment decisions",
    key: "makeBetterFinancialInvestmentDecisions",
    value: "Make better financial/investment decisions",
    selected: false
    },
    {
    name: "Build thought leadership",
    key: "buildThoughtLeadership",
    value: "Build thought leadership",
    selected: false
    },
    {
    name: "Access insider knowledge on companies for effective business negotiations",
    key: "accessInsiderKnowledgeOnCompanierForEffectiveBusinessNegotiations",
    value: "Access insider knowledge on companies for effective business negotiations",
    selected: false
    },
    {
    name: "Make effective strategies for my company/client",
    key: "makeEffectiveStrategiesForMyCompanyClient",
    value: "Make effective strategies for my company/client",
    selected: false
    },
    {
    name: "Sharpen my networking",
    key: "sharpenMyNetworking",
    value: "Sharpen my networking",
    selected: false
    },
    {
    name: "Others",
    key: "others",
    value: "Others",
    selected: false
    }
    ]
    }
    ]
    },
    {
    name: "Screen2",
    key: "screen2",
    displayOrder: 3,
    version: 1,
    templateId: "DropDown",
    boldTitle: "Let's Personalize Your ET Experience",
    editShowTitle: "",
    desc: "Share a bit about yourself and discover stories that matter to you.",
    questions: [
    {
    key: "industry",
    question: "Current Industry",
    type: "DropDown",
    showQuestion: true,
    options: [
    {
    name: "Select",
    key: "select",
    value: "Select",
    selected: false
    },
    {
    name: "Aerospace & Defense",
    key: "aerospaceDefense",
    value: "Aerospace & Defense",
    selected: false
    },
    {
    name: "Agriculture Industry",
    key: "agricultureIndustry",
    value: "Agriculture Industry",
    selected: false
    },
    {
    name: "Airlines & Aviation",
    key: "airlinesAviation",
    value: "Airlines & Aviation",
    selected: false
    },
    {
    name: "Automobiles & Automotives",
    key: "automobilesAutomotives",
    value: "Automobiles & Automotives",
    selected: false
    },
    {
    name: "Biotechnology",
    key: "biotechnology",
    value: "Biotechnology",
    selected: false
    },
    {
    name: "Banking",
    key: "banking",
    value: "Banking",
    selected: false
    },
    {
    name: "Chemical Industry",
    key: "chemicalIndustry",
    value: "Chemical Industry",
    selected: false
    },
    {
    name: "Compliance & Auditing",
    key: "complianceAuditing",
    value: "Compliance & Auditing",
    selected: false
    },
    {
    name: "Construction/Infrastructure",
    key: "constructionInfrastructure",
    value: "Construction/Infrastructure",
    selected: false
    },
    {
    name: "Consumer Goods & Services",
    key: "consumerGoodsServices",
    value: "Consumer Goods & Services",
    selected: false
    },
    {
    name: "Digital Media",
    key: "digitalMedia",
    value: "Digital Media",
    selected: false
    },
    {
    name: "Education & Training",
    key: "educationTraining",
    value: "Education & Training",
    selected: false
    },
    {
    name: "Electronics & Hardware Sector",
    key: "electronicsHardwareSector",
    value: "Electronics & Hardware Sector",
    selected: false
    },
    {
    name: "Energy & Power Sector",
    key: "energyPowerSector",
    value: "Energy & Power Sector",
    selected: false
    },
    {
    name: "Export - Import",
    key: "export-Import",
    value: "Export - Import",
    selected: false
    },
    {
    name: "Financial Services",
    key: "financialServices",
    value: "Financial Services",
    selected: false
    },
    {
    name: "Food Industry",
    key: "foodIndustry",
    value: "Food Industry",
    selected: false
    },
    {
    name: "Government & Public Sector",
    key: "governmentPublicSector",
    value: "Government & Public Sector",
    selected: false
    },
    {
    name: "HR & Recruitment",
    key: "hRRecruitment",
    value: "HR & Recruitment",
    selected: false
    },
    {
    name: "Hotels & Hospitality",
    key: "hotelsHospitality",
    value: "Hotels & Hospitality",
    selected: false
    },
    {
    name: "Insurance & Wealth Mangement",
    key: "insuranceWealthMangement",
    value: "Insurance & Wealth Mangement",
    selected: false
    },
    {
    name: "IT/ITES",
    key: "iTITES",
    value: "IT/ITES",
    selected: false
    },
    {
    name: "Trading & Investments",
    key: "tradingInvestments",
    value: "Trading & Investments",
    selected: false
    },
    {
    name: "Life Sciences ",
    key: "lifeSciences",
    value: "Life Sciences ",
    selected: false
    },
    {
    name: "Marketing & Advertising",
    key: "marketingAdvertising",
    value: "Marketing & Advertising",
    selected: false
    },
    {
    name: "Medical/Healthcare",
    key: "medicalHealthcare",
    value: "Medical/Healthcare",
    selected: false
    },
    {
    name: "Media - TV & Print",
    key: "media-TVPrint",
    value: "Media - TV & Print",
    selected: false
    },
    {
    name: "Mineral Extraction & Mining",
    key: "mineralExtractionMining",
    value: "Mineral Extraction & Mining",
    selected: false
    },
    {
    name: "Not For Profit & Social",
    key: "notForProfitSocial",
    value: "Not For Profit & Social",
    selected: false
    },
    {
    name: "Offline Retail",
    key: "offlineRetail",
    value: "Offline Retail",
    selected: false
    },
    {
    name: "Oil & Natural Gas",
    key: "oilNaturalGas",
    value: "Oil & Natural Gas",
    selected: false
    },
    {
    name: "Payment Industry",
    key: "paymentIndustry",
    value: "Payment Industry",
    selected: false
    },
    {
    name: "Product Design & Manufacturing",
    key: "productDesignManufacturing",
    value: "Product Design & Manufacturing",
    selected: false
    },
    {
    name: "Power & Electricity",
    key: "powerElectricity",
    value: "Power & Electricity",
    selected: false
    },
    {
    name: "Pharmaceuticals & Drugs",
    key: "pharmaceuticalsDrugs",
    value: "Pharmaceuticals & Drugs",
    selected: false
    },
    {
    name: "Real Estate",
    key: "realEstate",
    value: "Real Estate",
    selected: false
    },
    {
    name: "Sanitation & Waste Management",
    key: "sanitationWasteManagement",
    value: "Sanitation & Waste Management",
    selected: false
    },
    {
    name: "Sports, Arts & Entertainment",
    key: "sportsArtsEntertainment",
    value: "Sports, Arts & Entertainment",
    selected: false
    },
    {
    name: "Supply Chain & Logistics",
    key: "supplyChainLogistics",
    value: "Supply Chain & Logistics",
    selected: false
    },
    {
    name: "Technology",
    key: "technology",
    value: "Technology",
    selected: false
    },
    {
    name: "Telecom.",
    key: "telecom",
    value: "Telecom.",
    selected: false
    },
    {
    name: "Travel & Tourism",
    key: "travelTourism",
    value: "Travel & Tourism",
    selected: false
    },
    {
    name: "Road or Rail Transportation",
    key: "roadorRailTransportation",
    value: "Road or Rail Transportation",
    selected: false
    },
    {
    name: "Water Supply & Distribution",
    key: "waterSupplyDistribution",
    value: "Water Supply & Distribution",
    selected: false
    },
    {
    name: "Wholesale & Distribution",
    key: "wholesaleDistribution",
    value: "Wholesale & Distribution",
    selected: false
    }
    ]
    },
    {
    key: "jobRole",
    question: "Job Role",
    type: "DropDown",
    showQuestion: true,
    options: [
    {
    name: "Select",
    key: "select",
    value: "Select",
    selected: false
    },
    {
    name: "Angel Investor",
    key: "angelInvestor",
    value: "Angel Investor",
    selected: false
    },
    {
    name: "Artificial Intelligence Development",
    key: "artificialIntelligenceDevelopment",
    value: "Artificial Intelligence Development",
    selected: false
    },
    {
    name: "Asset or Fund Management",
    key: "assetorFundManagement",
    value: "Asset or Fund Management",
    selected: false
    },
    {
    name: "Account or Revenue Management",
    key: "accountorRevenueManagement",
    value: "Account or Revenue Management",
    selected: false
    },
    {
    name: "Brand Management",
    key: "brandManagement",
    value: "Brand Management",
    selected: false
    },
    {
    name: "Business Operations",
    key: "businessOperations",
    value: "Business Operations",
    selected: false
    },
    {
    name: "Communication or Translation",
    key: "communicationorTranslation",
    value: "Communication or Translation",
    selected: false
    },
    {
    name: "Community Development",
    key: "communityDevelopment",
    value: "Community Development",
    selected: false
    },
    {
    name: "Compliance & Risk Management",
    key: "complianceRiskManagement",
    value: "Compliance & Risk Management",
    selected: false
    },
    {
    name: "Consulting",
    key: "consulting",
    value: "Consulting",
    selected: false
    },
    {
    name: "Corporate Strategy",
    key: "corporateStrategy",
    value: "Corporate Strategy",
    selected: false
    },
    {
    name: "Customer Support",
    key: "customerSupport",
    value: "Customer Support",
    selected: false
    },
    {
    name: "Cyber Security",
    key: "cyberSecurity",
    value: "Cyber Security",
    selected: false
    },
    {
    name: "Data Science & Analytics",
    key: "dataScienceAnalytics",
    value: "Data Science & Analytics",
    selected: false
    },
    {
    name: "Design & Creative Services",
    key: "designCreativeServices",
    value: "Design & Creative Services",
    selected: false
    },
    {
    name: "Editorial/Video Content Production",
    key: "editorialVideoContentProduction",
    value: "Editorial/Video Content Production",
    selected: false
    },
    {
    name: "Engineering Services",
    key: "engineeringServices",
    value: "Engineering Services",
    selected: false
    },
    {
    name: "Environment Protection",
    key: "environmentProtection",
    value: "Environment Protection",
    selected: false
    },
    {
    name: "Financial Accounting",
    key: "financialAccounting",
    value: "Financial Accounting",
    selected: false
    },
    {
    name: "Financial Auditing",
    key: "financialAuditing",
    value: "Financial Auditing",
    selected: false
    },
    {
    name: "Food & Agriculture",
    key: "foodAgriculture",
    value: "Food & Agriculture",
    selected: false
    },
    {
    name: "Govt or Private Think Tank",
    key: "govtorPrivateThinkTank",
    value: "Govt or Private Think Tank",
    selected: false
    },
    {
    name: "Healthcare Services",
    key: "healthcareServices",
    value: "Healthcare Services",
    selected: false
    },
    {
    name: "Healthcare/Social Services",
    key: "healthcareSocialServices",
    value: "Healthcare/Social Services",
    selected: false
    },
    {
    name: "HR & Recruitment",
    key: "hRRecruitment",
    value: "HR & Recruitment",
    selected: false
    },
    {
    name: "Immigration & Citizenship",
    key: "immigrationCitizenship",
    value: "Immigration & Citizenship",
    selected: false
    },
    {
    name: "Insurance ",
    key: "insurance",
    value: "Insurance ",
    selected: false
    },
    {
    name: "Investment Banking",
    key: "investmentBanking",
    value: "Investment Banking",
    selected: false
    },
    {
    name: "Investor Relations",
    key: "investorRelations",
    value: "Investor Relations",
    selected: false
    },
    {
    name: "IT Infrastructure",
    key: "iTInfrastructure",
    value: "IT Infrastructure",
    selected: false
    },
    {
    name: "Legal Advisory & Services",
    key: "legalAdvisoryServices",
    value: "Legal Advisory & Services",
    selected: false
    },
    {
    name: "Legislator or Politician",
    key: "legislatororPolitician",
    value: "Legislator or Politician",
    selected: false
    },
    {
    name: "Licensing & Content Acquisition",
    key: "licensingContentAcquisition",
    value: "Licensing & Content Acquisition",
    selected: false
    },
    {
    name: "Marketing Services",
    key: "marketingServices",
    value: "Marketing Services",
    selected: false
    },
    {
    name: "Merchant Banking",
    key: "merchantBanking",
    value: "Merchant Banking",
    selected: false
    },
    {
    name: "Mergers & Acquisitions",
    key: "mergersAcquisitions",
    value: "Mergers & Acquisitions",
    selected: false
    },
    {
    name: "Military",
    key: "military",
    value: "Military",
    selected: false
    },
    {
    name: "Network Infrastructure",
    key: "networkInfrastructure",
    value: "Network Infrastructure",
    selected: false
    },
    {
    name: "Office Administration",
    key: "officeAdministration",
    value: "Office Administration",
    selected: false
    },
    {
    name: "Police & Security",
    key: "policeSecurity",
    value: "Police & Security",
    selected: false
    },
    {
    name: "Product Management",
    key: "productManagement",
    value: "Product Management",
    selected: false
    },
    {
    name: "Production or Service Delivery",
    key: "productionorServiceDelivery",
    value: "Production or Service Delivery",
    selected: false
    },
    {
    name: "Project Management",
    key: "projectManagement",
    value: "Project Management",
    selected: false
    },
    {
    name: "Public Relations",
    key: "publicRelations",
    value: "Public Relations",
    selected: false
    },
    {
    name: "Purchasing & Procurement",
    key: "purchasingProcurement",
    value: "Purchasing & Procurement",
    selected: false
    },
    {
    name: "R&D",
    key: "rD",
    value: "R&D",
    selected: false
    },
    {
    name: "Risk Management",
    key: "riskManagement",
    value: "Risk Management",
    selected: false
    },
    {
    name: "Real Estate Broker",
    key: "realEstateBroker",
    value: "Real Estate Broker",
    selected: false
    },
    {
    name: "Real Estate Construction",
    key: "realEstateConstruction",
    value: "Real Estate Construction",
    selected: false
    },
    {
    name: "Regulation & Policy",
    key: "regulationPolicy",
    value: "Regulation & Policy",
    selected: false
    },
    {
    name: "Relationship Management",
    key: "relationshipManagement",
    value: "Relationship Management",
    selected: false
    },
    {
    name: "Sales & Business Development",
    key: "salesBusinessDevelopment",
    value: "Sales & Business Development",
    selected: false
    },
    {
    name: "Securities & Trading",
    key: "securitiesTrading",
    value: "Securities & Trading",
    selected: false
    },
    {
    name: "Senior Leadership",
    key: "seniorLeadership",
    value: "Senior Leadership",
    selected: false
    },
    {
    name: "Student",
    key: "student",
    value: "Student",
    selected: false
    },
    {
    name: "Supply Chain & Logistics",
    key: "supplyChainLogistics",
    value: "Supply Chain & Logistics",
    selected: false
    },
    {
    name: "Teaching Faculty",
    key: "teachingFaculty",
    value: "Teaching Faculty",
    selected: false
    },
    {
    name: "Technology Development",
    key: "technologyDevelopment",
    value: "Technology Development",
    selected: false
    },
    {
    name: "Trade & Foreign Affairs",
    key: "tradeForeignAffairs",
    value: "Trade & Foreign Affairs",
    selected: false
    },
    {
    name: "Venture Capital or Private Equity",
    key: "ventureCapitalorPrivateEquity",
    value: "Venture Capital or Private Equity",
    selected: false
    }
    ]
    },
    {
    key: "experience",
    question: "Years of Experience",
    type: "DropDown",
    showQuestion: true,
    options: [
    {
    name: "Select",
    key: "select",
    value: "Select",
    selected: false
    },
    {
    name: "Less than 2 Years",
    key: "lessthan2Years",
    value: "Less than 2 Years",
    selected: false
    },
    {
    name: "2 - 5 Years",
    key: "2-5Years",
    value: "2 - 5 Years",
    selected: false
    },
    {
    name: "5 - 8 Years",
    key: "5-8Years",
    value: "5 - 8 Years",
    selected: false
    },
    {
    name: "8 - 11 Years",
    key: "8-11Years",
    value: "8 - 11 Years",
    selected: false
    },
    {
    name: "11 - 15 Years",
    key: "11-15Years",
    value: "11 - 15 Years",
    selected: false
    },
    {
    name: "15 - 20 Years",
    key: "15-20Years",
    value: "15 - 20 Years",
    selected: false
    },
    {
    name: "20+ Years",
    key: "20Years",
    value: "20+ Years",
    selected: false
    }
    ]
    },
    {
    key: "jobLevel",
    question: "Job Level",
    type: "DropDown",
    showQuestion: true,
    options: [
    {
    name: "Select",
    key: "select",
    value: "Select",
    selected: false
    },
    {
    name: "Founder or Business Owner",
    key: "founderorBusinessOwner",
    value: "Founder or Business Owner",
    selected: false
    },
    {
    name: "Board Level - C-Suite, Managing Director, Partner",
    key: "boardLevel-C-SuiteManagingDirectorPartner",
    value: "Board Level - C-Suite,Managing Director, Partner",
    selected: false
    },
    {
    name: "Most Senior Level - CXO, President, Chairman",
    key: "mostSeniorLevel-CXOPresidentChairman",
    value: "Most Senior Level - CXO, President, Chairman",
    selected: false
    },
    {
    name: "Executive Level - EVP, SVP, Business Head",
    key: "executiveLevel-EVPSVPBusinessHead",
    value: "Executive Level - EVP, SVP, Business Head",
    selected: false
    },
    {
    name: "Director Level - Dept. Head, VicePresident, Sr. Director",
    key: "directorLevel-DeptHeadVicePresidentSrDirector",
    value: "Director Level - Dept. Head, Vice President, Sr. Director",
    selected: false
    },
    {
    name: "Senior-Mid Level - Sr. Manager, Principal, Professor",
    key: "senior-MidLevel-SrManagerPrincipalProfessor",
    value: "Senior-Mid Level - Sr. Manager, Principal, Professor",
    selected: false
    },
    {
    name: "Mid Level - Manager, Sr Consultant, Team Lead",
    key: "midLevel-ManagerSrConsultantTeamLead",
    value: "Mid Level - Manager, SrConsultant, Team Lead",
    selected: false
    },
    {
    name: "Intermediate Level - Consultant, Assistant Manager, Associate",
    key: "intermediateLevel-ConsultantAssistantManagerAssociate",
    value: "Intermediate Level - Consultant, Assistant Manager,Associate",
    selected: false
    },
    {
    name: "Entry Level - Analyst, Engineer, Executive",
    key: "entryLevel-AnalystEngineerExecutive",
    value: "Entry Level - Analyst, Engineer, Executive",
    selected: false
    },
    {
    name: "Subject Matter Expert -Specialist, Author, Scientist",
    key: "subjectMatterExpert-SpecialistAuthorScientist",
    value: "Subject Matter Expert - Specialist, Author, Scientist",
    selected: false
    },
    {
    name: "Retired",
    key: "retired",
    value: "Retired",
    selected: false
    },
    {
    name: "Student",
    key: "student",
    value: "Student",
    selected: false
    }
    ]
    }
    ]
    },
    {
    name: "Screen3",
    key: "screen3",
    displayOrder: 4,
    version: 1,
    templateId: "GridImg",
    boldTitle: "Industries on your radar",
    editShowTitle: "",
    desc: "Select Industries you’d like to read more about",
    questions: [
    {
    key: "categories",
    question: "Categories of Interest",
    type: "Checkbox",
    showQuestion: true,
    options: [
    {
    name: "Tech",
    key: "tech",
    desc: "The people, companies, and themes shaping the brave new world",
    iconUrl: "https://img.etimg.com/photo/79321020.cms",
    imageUrl: "https://img.etimg.com/photo/79321020.cms"
    },
    {
    name: "Consumer",
    key: "consumer",
    desc: "What’s flying off the shelves, what’s not, and why",
    iconUrl: "https://img.etimg.com/photo/79321021.cms",
    imageUrl: "https://img.etimg.com/photo/79321021.cms"
    },
    {
    name: "Markets",
    key: "markets",
    desc: "The art, science, and hidden trends of investing",
    iconUrl: "https://img.etimg.com/photo/79321025.cms",
    imageUrl: "https://img.etimg.com/photo/79321025.cms"
    },
    {
    name: "Corporate Governance",
    key: "corpGov",
    desc: "Exclusive investigations into critical company actions",
    iconUrl: "https://img.etimg.com/photo/79321033.cms",
    imageUrl: "https://img.etimg.com/photo/79321033.cms"
    },
    {
    name: "Telecom + OTT",
    key: "telecomOTT",
    desc: "What’s inside your phone and on your screen",
    iconUrl: "https://img.etimg.com/photo/79321018.cms",
    imageUrl: "https://img.etimg.com/photo/79321018.cms"
    },
    {
    name: "Auto + Aviation",
    key: "autoAviation",
    desc: "What's driving the auto sector",
    iconUrl: "https://img.etimg.com/photo/79321034.cms",
    imageUrl: "https://img.etimg.com/photo/79321034.cms"
    },
    {
    name: "Pharma",
    key: "pharma",
    desc: "Inside the business of healing",
    iconUrl: "https://img.etimg.com/photo/79321022.cms",
    imageUrl: "https://img.etimg.com/photo/79321022.cms"
    },
    {
    name: "Fintech + BFSI",
    key: "fintechBFSI",
    desc: "The technology and people that move the world’s money",
    iconUrl: "https://img.etimg.com/photo/79321026.cms",
    imageUrl: "https://img.etimg.com/photo/79321026.cms"
    },
    {
    name: "Economy",
    key: "economy",
    desc: "Making sense of the big picture",
    iconUrl: "https://img.etimg.com/photo/79321032.cms",
    imageUrl: "https://img.etimg.com/photo/79321032.cms"
    },
    {
    name: "Infra",
    key: "infra",
    desc: "Tracking the economy's building blocks",
    iconUrl: "https://img.etimg.com/photo/79321027.cms",
    imageUrl: "https://img.etimg.com/photo/79321027.cms"
    },
    {
    name: "Environment",
    key: "environment",
    desc: "The business and economics of climate change",
    iconUrl: "https://img.etimg.com/photo/79321028.cms",
    imageUrl: "https://img.etimg.com/photo/79321028.cms"
    },
    {
    name: "Energy",
    key: "energy",
    desc: "The policy and business of fossil fuels and clean energy",
    iconUrl: "https://img.etimg.com/photo/79321031.cms",
    imageUrl: "https://img.etimg.com/photo/79321031.cms"
    }
    ]
    }
    ]
    },
    {
    name: "Screen4",
    key: "screen4",
    displayOrder: 5,
    version: 1,
    templateId: "Grid",
    boldTitle: "Topics of Interest",
    editShowTitle: "",
    desc: "Select & get more stories on topics that really matter to you",
    questions: [
    {
    key: "topicOfInterest",
    question: "Topics of Interest",
    type: "Checkbox",
    showQuestion: true,
    options: [
    {
    name: "Startups & Fundraising",
    key: "startupsFundraising",
    value: "Startups & Fundraising",
    selected: false
    },
    {
    name: "Stocks & Trading",
    key: "stocksTrading",
    value: "Stocks & Trading",
    selected: false
    },
    {
    name: "Wealth Management",
    key: "wealthManagement",
    value: "Wealth Management",
    selected: false
    },
    {
    name: "Leadership",
    key: "leadership",
    value: "Leadership",
    selected: false
    },
    {
    name: "Business Strategy",
    key: "businessStrategy",
    value: "Business Strategy",
    selected: false
    },
    {
    name: "Online Marketplaces",
    key: "onlineMarketplaces",
    value: "Online Marketplaces",
    selected: false
    },
    {
    name: "Mergers & Acquisitions",
    key: "mergersAcquisitions",
    value: "Mergers & Acquisitions",
    selected: false
    },
    {
    name: "Operations & Logistics",
    key: "operationsLogistics",
    value: "Operations & Logistics",
    selected: false
    },
    {
    name: "Digital Payments",
    key: "digitalPayments",
    value: "Digital Payments",
    selected: false
    },
    {
    name: "Fintech",
    key: "fintech",
    value: "Fintech",
    selected: false
    },
    {
    name: "SaaS",
    key: "saaS",
    value: "SaaS",
    selected: false
    },
    {
    name: "Digital Content & Subscriptions",
    key: "digitalContentSubscriptions",
    value: "Digital Content & Subscriptions",
    selected: false
    },
    {
    name: "Artificial Intelligence",
    key: "artificialIntelligence",
    value: "Artificial Intelligence",
    selected: false
    },
    {
    name: "Policy & Regulations",
    key: "policyRegulations",
    value: "Policy & Regulations",
    selected: false
    },
    {
    name: "Biotechnology",
    key: "biotechnology",
    value: "Biotechnology",
    selected: false
    },
    {
    name: "Future of Mobility",
    key: "futureofMobility",
    value: "Future of Mobility",
    selected: false
    }
    ]
    }
    ]
    },
    {
    name: "Screen7",
    key: "screen7",
    displayOrder: 6,
    templateId: "Newsletters",
    boldTitle: "Subscribe to Newsletters",
    editShowTitle: "",
    desc: "Caffeine for the mind. Delivered to your inbox.",
    questions: [
    {
    key: "newsletters",
    question: "Newsletters",
    type: "Checkbox",
    showQuestion: true,
    options: [
    {
    name: "5f5a31db80f79664e95679da",
    key: "5f5a31db80f79664e95679da",
    value: "ET Economy Newsletter",
    displayOrder: 1,
    selected: false,
    subscribed: false,
    desc: "Is India on the right track? Track the economic indicators",
    imageUrl: "https://img.etimg.com/thumb/height-195,width-195,msid-77526755/resizemode-4/icon.jpg"
    },
    {
    name: "5f5a31db80f79664e95679d9",
    key: "5f5a31db80f79664e95679d9",
    value: "ET Tech Newsletter",
    displayOrder: 2,
    selected: false,
    subscribed: false,
    desc: "Stay on top of the biggest stories shaping tech with our deep dives",
    imageUrl: "https://img.etimg.com/thumb/height-195,width-195,msid-77848432/resizemode-4/icon.jpg"
    },
    {
    name: "5f5a31db80f79664e95679ca",
    key: "5f5a31db80f79664e95679ca",
    value: "Markets Watch",
    displayOrder: 3,
    selected: false,
    subscribed: false,
    desc: "Stocks, bonds, money and more, track what's keeping the bourse moving",
    imageUrl: "https://img.etimg.com/thumb/height-195,width-195,msid-77526788/resizemode-4/icon.jpg"
    },
    {
    name: "5f5a31db80f79664e95679d5",
    key: "5f5a31db80f79664e95679d5",
    value: "ET RISE Biz Listings",
    displayOrder: 4,
    selected: false,
    subscribed: false,
    desc: "ET RISE Biz Listings",
    imageUrl: "https://img.etimg.com/thumb/height-195,width-195,msid-77526685/resizemode-4/icon.jpg"
    },
    {
    name: "5f5a31db80f79664e95679ce",
    key: "5f5a31db80f79664e95679ce",
    value: "ET Sunday Wrap",
    displayOrder: 5,
    selected: false,
    subscribed: false,
    desc: "Didn't get time to catch up on news? We have your Sundays sorted",
    imageUrl: "https://img.etimg.com/thumb/height-195,width-195,msid-77526863/resizemode-4/icon.jpg"
    },
    {
    name: "5f5a31db80f79664e95679cf",
    key: "5f5a31db80f79664e95679cf",
    value: "ET Mutual Funds",
    displayOrder: 6,
    selected: false,
    subscribed: false,
    desc: "Got mutual funds on mind? We have everything you need to know",
    imageUrl: "https://img.etimg.com/thumb/height-195,width-195,msid-77526906/resizemode-4/icon.jpg"
    },
    {
    name: "5f5a31db80f79664e95679d0",
    key: "5f5a31db80f79664e95679d0",
    value: "ET Investment Opportunities",
    displayOrder: 7,
    selected: false,
    subscribed: false,
    desc: "The best investment choices in your mail box from ET",
    imageUrl: "https://img.etimg.com/thumb/height-195,width-195,msid-77526967/resizemode-4/icon.jpg"
    },
    {
    name: "5f5a31db80f79664e95679c8",
    key: "5f5a31db80f79664e95679c8",
    value: "Weekend Platter",
    displayOrder: 8,
    selected: false,
    subscribed: false,
    desc: "Everything that made headlines & and the impact decoded just for you",
    imageUrl: "https://img.etimg.com/thumb/height-195,width-195,msid-77526890/resizemode-4/icon.jpg"
    },
    {
    name: "610a5e3ce7c4da1efefcdc40",
    key: "610a5e3ce7c4da1efefcdc40",
    value: "ETMarkets DeCrypt",
    displayOrder: 9,
    selected: false,
    subscribed: false,
    desc: "Expert's perspective every week on Cryptocurrency",
    imageUrl: "https://img.etimg.com/photo/msid-85647077,quality-100/crypto.jpg"
    },
    {
    name: "5f5a31db80f79664e95679cb",
    key: "5f5a31db80f79664e95679cb",
    value: "ET Wealth",
    displayOrder: 10,
    selected: false,
    subscribed: false,
    desc: "The week's best and important stories for all your personal finance needs",
    imageUrl: "https://img.etimg.com/thumb/height-195,width-195,msid-77526647/resizemode-4/icon.jpg"
    }
    ]
    }
    ]
    },
    {
    name: "Screen5",
    key: "screen5",
    displayOrder: 7,
    version: 1,
    templateId: "DropDown",
    boldTitle: "When do you prefer to read?",
    editShowTitle: "When do you read ET Prime?",
    desc: "",
    questions: [
    {
    key: "weekdays",
    question: "Weekdays",
    type: "DropDown",
    showQuestion: true,
    options: [
    {
    name: "Select Time Slot",
    key: "selectTimeSlot",
    value: "Select Time Slot",
    selected: false
    },
    {
    name: "Early Morning, 6 - 9 am",
    key: "earlyMorning6-9am",
    value: "Early Morning, 6 - 9 am",
    selected: false
    },
    {
    name: "Later in the Morning, 9 - 11 am",
    key: "laterintheMorning9-11am",
    value: "Later in the Morning, 9 - 11 am",
    selected: false
    },
    {
    name: "Afternoon, 12 - 4 pm",
    key: "afternoon12-4pm",
    value: "Afternoon, 12 - 4 pm",
    selected: false
    },
    {
    name: "Evening, 4 - 7 pm",
    key: "evening4-7pm",
    value: "Evening, 4 - 7 pm",
    selected: false
    },
    {
    name: "Late Evening, 7 - 10 pm",
    key: "lateEvening7-10pm",
    value: "Late Evening, 7 - 10 pm",
    selected: false
    },
    {
    name: "Late Night, 10 pm onwards",
    key: "lateNight10pmonwards",
    value: "Late Night, 10 pm onwards",
    selected: false
    }
    ]
    },
    {
    key: "weekend",
    question: "Weekends",
    type: "DropDown",
    showQuestion: true,
    options: [
    {
    name: "Select Time Slot",
    key: "selectTimeSlot",
    value: "Select Time Slot",
    selected: false
    },
    {
    name: "Early Morning, 6 - 9 am",
    key: "earlyMorning6-9am",
    value: "Early Morning, 6 - 9 am",
    selected: false
    },
    {
    name: "Later in the Morning, 9 - 11 am",
    key: "laterintheMorning9-11am",
    value: "Later in the Morning, 9 - 11 am",
    selected: false
    },
    {
    name: "Afternoon, 12 - 4 pm",
    key: "afternoon12-4pm",
    value: "Afternoon, 12 - 4 pm",
    selected: false
    },
    {
    name: "Evening, 4 - 7 pm",
    key: "evening4-7pm",
    value: "Evening, 4 - 7 pm",
    selected: false
    },
    {
    name: "Late Evening, 7 - 10 pm",
    key: "lateEvening7-10pm",
    value: "Late Evening, 7 - 10 pm",
    selected: false
    },
    {
    name: "Late Night, 10 pm onwards",
    key: "lateNight10pmonwards",
    value: "Late Night, 10 pm onwards",
    selected: false
    }
    ]
    }
    ]
    },
    {
    name: "Screen8",
    key: "Screen8",
    templateId: "ET APP",
    boldTitle: "Profit on the go. Take ET with you.",
    editShowTitle: "",
    desc: "Download ET APP",
    displayOrder: 8,
    version: 2,
    questions: [
    {
    key: "etappdownload",
    question: "etappdownload",
    type: "Checbox",
    showQuestion: true,
    options: [
    {
    name: "etappdownload",
    key: "etappdownload",
    value: "ET APP Download ",
    selected: false
    },
    {
    name: "nothanks",
    key: "nothanks",
    value: "No Thanks",
    selected: false
    }
    ]
    }
    ]
    },
    {
    name: "Screen9",
    key: "Screen9",
    templateId: "ET MARKET APP",
    boldTitle: "All about the markets. Right in your pocket.",
    editShowTitle: "",
    desc: "Download ET MARKETS APP",
    displayOrder: 9,
    version: 2,
    questions: [
    {
    key: "etmarketappdownload",
    question: "etmarketappdownload",
    type: "Checbox",
    showQuestion: true,
    options: [
    {
    name: "etmarketappdownload",
    key: "etmarketappdownload",
    value: "ET MATRKET APP Download ",
    selected: false
    },
    {
    name: "nothanks",
    key: "nothanks",
    value: "No Thanks",
    selected: false
    }
    ]
    }
    ]
    },
    {
    name: "Screen1",
    key: "screen1",
    version: 2,
    questions: [
    {
    key: "name",
    question: "Enter your Name",
    name: "Name",
    displayOrder: 1,
    type: "Text",
    showQuestion: true
    },
    {
    key: "email",
    question: "What is your email?",
    name: "Email",
    displayOrder: 2,
    type: "Text",
    showQuestion: true
    },
    {
    key: "occupation",
    question: "What is your current occupation?",
    name: "Occupation",
    displayOrder: 3,
    type: "DropDown",
    showQuestion: true,
    options: [
    {
    name: "Working Professional",
    key: "workingProfessional",
    value: "Working Professional",
    selected: false
    },
    {
    name: "Student",
    key: "student",
    value: "Student",
    selected: false
    },
    {
    name: "Retired Professional",
    key: "retiredProfessional",
    value: "Retired Professional",
    selected: false
    },
    {
    name: "Self Employed/Entrepreneur",
    key: "selfEmployedEntrepreneur",
    value: "Self Employed/Entrepreneur",
    selected: false
    },
    {
    name: "Others",
    key: "others",
    value: "Others",
    selected: false
    }
    ]
    },
    {
    key: "jobTitle",
    question: "Enter your Job Title",
    name: "Job Title",
    type: "Text",
    displayOrder: 4,
    parentQuestionKey: "workingProfessional",
    showQuestion: true
    },
    {
    key: "educationMajor",
    question: "Enter your Education Major",
    name: "Education Major",
    type: "DropDown",
    displayOrder: 4,
    showQuestion: true,
    parentQuestionKey: "student",
    options: [
    {
    name: "Bachelor's Degree",
    key: "bachelorsDegree",
    value: "Bachelor's Degree",
    selected: false
    },
    {
    name: "Master's Degree",
    key: "mastersDegree",
    value: "Master's Degree",
    selected: false
    },
    {
    name: "Postgraduate Diploma",
    key: "postgraduateDiploma",
    value: "Postgraduate Diploma",
    selected: false
    },
    {
    name: "Professional Certification",
    key: "professionalCertification",
    value: "Professional Certification",
    selected: false
    },
    {
    name: "Other",
    key: "other",
    value: "Other",
    selected: false
    }
    ]
    },
    {
    key: "companyName",
    question: "Enter your Company Name",
    name: "Company Name",
    type: "Text",
    displayOrder: 5,
    showQuestion: true,
    parentQuestionKey: "workingProfessional"
    },
    {
    key: "graduationYear",
    question: "Graduation Completion Year",
    name: "Graduation Year",
    type: "DropDown",
    displayOrder: 5,
    showQuestion: true,
    parentQuestionKey: "student",
    options: [
    {
    name: "1950",
    key: "1950",
    value: "1950",
    selected: false
    },
    {
    name: "1951",
    key: "1951",
    value: "1951",
    selected: false
    },
    {
    name: "1952",
    key: "1952",
    value: "1952",
    selected: false
    },
    {
    name: "1953",
    key: "1953",
    value: "1953",
    selected: false
    },
    {
    name: "1954",
    key: "1954",
    value: "1954",
    selected: false
    },
    {
    name: "1955",
    key: "1955",
    value: "1955",
    selected: false
    },
    {
    name: "1956",
    key: "1956",
    value: "1956",
    selected: false
    },
    {
    name: "1957",
    key: "1957",
    value: "1957",
    selected: false
    },
    {
    name: "1958",
    key: "1958",
    value: "1958",
    selected: false
    },
    {
    name: "1959",
    key: "1959",
    value: "1959",
    selected: false
    },
    {
    name: "1960",
    key: "1960",
    value: "1960",
    selected: false
    },
    {
    name: "1961",
    key: "1961",
    value: "1961",
    selected: false
    },
    {
    name: "1962",
    key: "1962",
    value: "1962",
    selected: false
    },
    {
    name: "1963",
    key: "1963",
    value: "1963",
    selected: false
    },
    {
    name: "1964",
    key: "1964",
    value: "1964",
    selected: false
    },
    {
    name: "1965",
    key: "1965",
    value: "1965",
    selected: false
    },
    {
    name: "1966",
    key: "1966",
    value: "1966",
    selected: false
    },
    {
    name: "1967",
    key: "1967",
    value: "1967",
    selected: false
    },
    {
    name: "1968",
    key: "1968",
    value: "1968",
    selected: false
    },
    {
    name: "1969",
    key: "1969",
    value: "1969",
    selected: false
    },
    {
    name: "1970",
    key: "1970",
    value: "1970",
    selected: false
    },
    {
    name: "1971",
    key: "1971",
    value: "1971",
    selected: false
    },
    {
    name: "1972",
    key: "1972",
    value: "1972",
    selected: false
    },
    {
    name: "1973",
    key: "1973",
    value: "1973",
    selected: false
    },
    {
    name: "1974",
    key: "1974",
    value: "1974",
    selected: false
    },
    {
    name: "1975",
    key: "1975",
    value: "1975",
    selected: false
    },
    {
    name: "1976",
    key: "1976",
    value: "1976",
    selected: false
    },
    {
    name: "1977",
    key: "1977",
    value: "1977",
    selected: false
    },
    {
    name: "1978",
    key: "1978",
    value: "1978",
    selected: false
    },
    {
    name: "1979",
    key: "1979",
    value: "1979",
    selected: false
    },
    {
    name: "1980",
    key: "1980",
    value: "1980",
    selected: false
    },
    {
    name: "1981",
    key: "1981",
    value: "1981",
    selected: false
    },
    {
    name: "1982",
    key: "1982",
    value: "1982",
    selected: false
    },
    {
    name: "1983",
    key: "1983",
    value: "1983",
    selected: false
    },
    {
    name: "1984",
    key: "1984",
    value: "1984",
    selected: false
    },
    {
    name: "1985",
    key: "1985",
    value: "1985",
    selected: false
    },
    {
    name: "1986",
    key: "1986",
    value: "1986",
    selected: false
    },
    {
    name: "1987",
    key: "1987",
    value: "1987",
    selected: false
    },
    {
    name: "1988",
    key: "1988",
    value: "1988",
    selected: false
    },
    {
    name: "1989",
    key: "1989",
    value: "1989",
    selected: false
    },
    {
    name: "1990",
    key: "1990",
    value: "1990",
    selected: false
    },
    {
    name: "1991",
    key: "1991",
    value: "1991",
    selected: false
    },
    {
    name: "1992",
    key: "1992",
    value: "1992",
    selected: false
    },
    {
    name: "1993",
    key: "1993",
    value: "1993",
    selected: false
    },
    {
    name: "1994",
    key: "1994",
    value: "1994",
    selected: false
    },
    {
    name: "1995",
    key: "1995",
    value: "1995",
    selected: false
    },
    {
    name: "1996",
    key: "1996",
    value: "1996",
    selected: false
    },
    {
    name: "1997",
    key: "1997",
    value: "1997",
    selected: false
    },
    {
    name: "1998",
    key: "1998",
    value: "1998",
    selected: false
    },
    {
    name: "1999",
    key: "1999",
    value: "1999",
    selected: false
    },
    {
    name: "2000",
    key: "2000",
    value: "2000",
    selected: false
    },
    {
    name: "2001",
    key: "2001",
    value: "2001",
    selected: false
    },
    {
    name: "2002",
    key: "2002",
    value: "2002",
    selected: false
    },
    {
    name: "2003",
    key: "2003",
    value: "2003",
    selected: false
    },
    {
    name: "2004",
    key: "2004",
    value: "2004",
    selected: false
    },
    {
    name: "2005",
    key: "2005",
    value: "2005",
    selected: false
    },
    {
    name: "2006",
    key: "2006",
    value: "2006",
    selected: false
    },
    {
    name: "2007",
    key: "2007",
    value: "2007",
    selected: false
    },
    {
    name: "2008",
    key: "2008",
    value: "2008",
    selected: false
    },
    {
    name: "2009",
    key: "2009",
    value: "2009",
    selected: false
    },
    {
    name: "2010",
    key: "2010",
    value: "2010",
    selected: false
    },
    {
    name: "2011",
    key: "2011",
    value: "2011",
    selected: false
    },
    {
    name: "2012",
    key: "2012",
    value: "2012",
    selected: false
    },
    {
    name: "2013",
    key: "2013",
    value: "2013",
    selected: false
    },
    {
    name: "2014",
    key: "2014",
    value: "2014",
    selected: false
    },
    {
    name: "2015",
    key: "2015",
    value: "2015",
    selected: false
    },
    {
    name: "2016",
    key: "2016",
    value: "2016",
    selected: false
    },
    {
    name: "2017",
    key: "2017",
    value: "2017",
    selected: false
    },
    {
    name: "2018",
    key: "2018",
    value: "2018",
    selected: false
    },
    {
    name: "2019",
    key: "2019",
    value: "2019",
    selected: false
    },
    {
    name: "2020",
    key: "2020",
    value: "2020",
    selected: false
    },
    {
    name: "2021",
    key: "2021",
    value: "2021",
    selected: false
    },
    {
    name: "2022",
    key: "2022",
    value: "2022",
    selected: false
    },
    {
    name: "2023",
    key: "2023",
    value: "2023",
    selected: false
    },
    {
    name: "2024",
    key: "2024",
    value: "2024",
    selected: false
    },
    {
    name: "2025",
    key: "2025",
    value: "2025",
    selected: false
    },
    {
    name: "2026",
    key: "2026",
    value: "2026",
    selected: false
    }
    ]
    },
    {
    key: "location",
    question: "Enter you Location",
    name: "Location",
    type: "Text",
    displayOrder: 6,
    showQuestion: true
    },
    {
    key: "mobile",
    question: "Enter your Mobile",
    name: "Mobile",
    type: "Text",
    displayOrder: 7,
    showQuestion: true
    },
    {
    key: "incomeRange",
    question: "Select your income range to help us share the best tax saving & investment advice.",
    name: "Income Range",
    type: "DropDown",
    displayOrder: 8,
    showQuestion: true,
    parentQuestionKey: "workingProfessional, selfEmployedEntrepreneur",
    options: [
    {
    name: "0-10 LPA",
    key: "0-10 LPA",
    value: "0-10 LPA",
    selected: false
    },
    {
    name: "11-25 LPA",
    key: "11-25 LPA",
    value: "11-25 LPA",
    selected: false
    },
    {
    name: "26-50 LPA",
    key: "26-50 LPA",
    value: "26-50 LPA",
    selected: false
    },
    {
    name: "50 LPA-1Cr",
    key: "50 LPA-1Cr",
    value: "50 LPA-1Cr",
    selected: false
    },
    {
    name: "Greater than 1Cr",
    key: "Greater than 1Cr",
    value: "Greater than 1Cr",
    selected: false
    }
    ]
    }
    ]
    }
    ]

const OnboardingSilde = ( {fetchQuesData} ) => {
    
    const [screens, setScreens] = useState(testJSON); //useState(fetchQuesData?.questionnaireDto?.screens || []);
    const [slideIndex, setslideIndex] = useState(0);
    const [totalSlide, setTotalSlide] = useState(0);

    console.log("fetchQuesData--", screens.length);

    const createRes = () => {
        // Finding the visible survey screen
        const surveyScreens = document.querySelectorAll(`.${styles.onboardingSlideWrp} .${styles.surveyScrn}`);
        let visScrn;
        surveyScreens.forEach((screen) => {
          const htmlElement = screen as HTMLElement;
          if (htmlElement.offsetParent !== null) {
            visScrn = htmlElement;
          }
        });
    
        if (!visScrn) return;
    
        let scrnType = visScrn.getAttribute('data-scrn');
        const scrnObj = [];
        const _topicOfInterest = (document.querySelector(`.${styles.surveyScrn}[data-ques=topicOfInterest]`) as HTMLElement).offsetParent !== null;
    
        if (_topicOfInterest) {
          scrnType = 'grid_type_2';
        }
    
        switch (scrnType) {
          case "text_type":
            visScrn.querySelectorAll("input[type='text']").forEach((input) => {
                (scrnObj as any).push({
                questionKey: input.getAttribute('name'),
                answer: input.value
              });
            });
            break;
          case "dd_type":
            visScrn.querySelectorAll("select").forEach((select) => {
              if (select.classList.contains("slt_chg")) {
                const ansArr:any[] = [];
                select.querySelectorAll("option").forEach((option, i) => {
                  if (i > 0) {
                    ansArr.push({
                      name: option.value,
                      key: option.getAttribute('data-key'),
                      value: option.value,
                      selected: option.selected
                    });
                  }
                });
                (scrnObj as any).push({
                  questionKey: select.getAttribute('name'),
                  answers: ansArr
                });
              }
            });
            break;
          case 'grid_type':
          case 'grid_type_2':
            const ansArr:any[] = [];
            visScrn.querySelectorAll("input[type='checkbox']").forEach((input) => {
              const answer:any = {
                key: input.getAttribute('data-key'),
                name: input.getAttribute('data-name'),
                selected: input.checked
              };
              if (scrnType === 'grid_type') {
                answer.desc = input.getAttribute('data-desc');
                answer.iconUrl = input.getAttribute('data-iconUrl');
                answer.imageUrl = input.getAttribute('data-imageUrl');
              }
              ansArr.push(answer);
            });
    
            (scrnObj as any).push({
              questionKey: visScrn.getAttribute('data-ques'),
              answers: ansArr
            });
            break;
          case "ET APP":
          case "ET MARKET APP":
            const appAnsArr = [
              {
                name: scrnType === "ET APP" ? "etappdownload" : "etmarketappdownload",
                key: scrnType === "ET APP" ? "etappdownload" : "etmarketappdownload",
                value: `${scrnType === "ET APP" ? "ET APP" : "ET MARKET APP"} Download `,
                selected: false
              },
              {
                name: "nothanks",
                key: "nothanks",
                value: "No Thanks",
                selected: document.querySelector(`[data-ques="${scrnType === "ET APP" ? "etappdownload" : "etmarketappdownload"}"]`)?.classList.contains("nothanks") || false
              }
            ];
    
            (scrnObj as any).push({
              questionKey: visScrn.getAttribute('data-ques'),
              answers: appAnsArr
            });
            break;
          case "Newsletters":
            const newsletterAnsArr:any[] = [];
            visScrn.querySelectorAll(".nl_wrp").forEach((wrp) => {
              newsletterAnsArr.push({
                desc: wrp.getAttribute('data-desc'),
                imageUrl: wrp.getAttribute('data-img'),
                key: wrp.getAttribute('data-id'),
                name: wrp.getAttribute('data-id'),
                selected: wrp.getAttribute('data-select') === 'true',
                subscribed: wrp.getAttribute('data-subs') === 'true',
                value: wrp.getAttribute('data-name')
              });
            });
    
            (scrnObj as any).push({
              questionKey: visScrn.getAttribute('data-ques'),
              answers: newsletterAnsArr
            });
            break;
          default:
            break;
        }
    
        return {
          uuid: "ad7qnu3xtwikuv358ln9pftex",
          responses: scrnObj,
          hitCount: fetchQuesData?.questionnaireDto?.hitCount,
          paidUser: true
        };
    };

    const handleContinueBtn = (slideIndex) => {
        const resObj = createRes();

        console.log("resObj--", resObj);
        
        setslideIndex(slideIndex+ 1)
        const items = document.querySelectorAll(`.${styles['surveyScrn']}`);
        items[slideIndex]?.classList.remove(`${styles['slideBlock']}`);
        items[slideIndex + 1]?.classList.add(`${styles['slideBlock']}`);
    }

    const handleBackBtn = () => {
        setslideIndex(slideIndex - 1)
        const items = document.querySelectorAll(`.${styles['surveyScrn']}`);
        items[slideIndex]?.classList.remove(`${styles['slideBlock']}`);
        items[slideIndex - 1]?.classList.add(`${styles['slideBlock']}`);
    }

    useEffect(() => {
        const items = document.querySelectorAll(`.${styles['surveyScrn']}`);
        setTotalSlide(items.length);
        console.log("items --- ", items.length);
    }, [])

    const renderScreens = () => {
        console.log("renderScreens", screens)
        return screens.map((screen, index) => {
            switch (screen.templateId) {
                case "TextType":
                    return <TextScreen key={index} slideIndex={index} totalSlide={totalSlide} data={screen} objObd={undefined} handleContinueBtn={handleContinueBtn} />;
                case "ET APP":
                case "ET MARKET APP":    
                    return <AppDownloadScreen key={index} slideIndex={index} totalSlide={totalSlide} data={screen} type={(screen as any).type} handleContinueBtn={handleContinueBtn} />;
                case "DropDown":
                    return <DropdownScreen key={index} slideIndex={index} totalSlide={totalSlide} data={screen} handleContinueBtn={handleContinueBtn}  />;
                case "Grid":
                case "GridImg":    
                    return <GridScreen key={index} slideIndex={index} totalSlide={totalSlide} data={screen} handleContinueBtn={handleContinueBtn} />;    
                case "Newsletters":    
                    return <NewsletterScreen key={index} slideIndex={index} totalSlide={totalSlide} data={screen} handleContinueBtn={handleContinueBtn} />;        
                default:
                    return null;
            }
        });
    };

    return (
        <div id="epslideshow" className={`${styles.pagesWrap}`}>
            <div className={`${styles.btn_back} ${slideIndex == 0 ? styles.hide : ''}`} onClick={() => handleBackBtn()}>
                <span>&#10094; Back</span>
            </div>
            <div className={`${styles.cButton}`}>
                <span id="close">X</span>
            </div>
            <ul className={styles.onboardingSlideWrp}>
                {renderScreens()}
            </ul>
            {
                totalSlide > 0 && <div>
                    <ul className={styles.pagination}>
                        {Array.from({ length: totalSlide }).map((_, index) => (
                            <li key={index} className={index == slideIndex ? styles.active: ''}></li>
                        ))}
                    </ul>
                </div>
            }
        </div>
    )
}

export default OnboardingSilde;