import type { Community, Post, User, Node, Edge, NodeProposal, EdgeProposal } from "../schema";


// ----------------------------
// Dummy Nodes
// ----------------------------
export const dummyNodes: Node[] = [
  {
    id: "n1",
    labels: ["Person"],
    name: "Alice",
    properties: [
      { key: "age", value: 28 },
      { key: "city", value: "New York" },
    ],
  },
  {
    id: "n2",
    labels: ["Person"],
    name: "Bob",
    properties: [
      { key: "age", value: 32 },
      { key: "city", value: "London" },
    ],
  },
  {
    id: "n3",
    labels: ["Company"],
    name: "Techify Inc.",
    properties: [
      { key: "industry", value: "Software" },
      { key: "founded", value: 2016 },
    ],
  },
  {
    id: "n4",
    labels: ["Project", "entity"],
    name: "NeuralVision",
    properties: [
      { key: "status", value: "Active" },
      { key: "budget", value: 500000 },
    ],
  },
  {
    id: "n5",
    labels: ["Person"],
    name: "Charlie",
    properties: [
      { key: "age", value: 25 },
      { key: "city", value: "San Francisco" },
    ],
  },
];

// ----------------------------
// Dummy Edges
// ----------------------------
export const dummyEdges: Edge[] = [
  {
    id: "e1",
    sourceId: "n1",
    targetId: "n2",
    type: "FRIENDS_WITH",
    properties: [
      { key: "since", value: 2018 },
      { key: "metAt", value: "Conference" },
    ],
  },
  {
    id: "e2",
    sourceId: "n1",
    targetId: "n3",
    type: "WORKS_AT",
    properties: [
      { key: "role", value: "Software Engineer" },
      { key: "since", value: 2020 },
    ],
  },
  {
    id: "e3",
    sourceId: "n2",
    targetId: "n3",
    type: "INVESTED_IN",
    properties: [
      { key: "amount", value: 100000 },
      { key: "currency", value: "USD" },
    ],
  },
  {
    id: "e4",
    sourceId: "n3",
    targetId: "n4",
    type: "OWNS",
    properties: [
      { key: "since", value: 2022 },
      { key: "stake", value: "100%" },
    ],
  },
  {
    id: "e5",
    sourceId: "n5",
    targetId: "n4",
    type: "CONTRIBUTES_TO",
    properties: [
      { key: "role", value: "Data Scientist" },
      { key: "hoursPerWeek", value: 20 },
    ],
  },
];

// ----------------------------
// Dummy Node Proposals
// ----------------------------
export const dummyNodeProposals: NodeProposal[] = [
  {
    id: "np1",
    labels: ["Technology", "AI"],
    name: "Machine Learning Framework",
    properties: [
      { key: "description", value: "A new ML framework for distributed training" },
      { key: "version", value: "1.0.0" },
    ],
    userId: "u1",
    userName: "Lakshay LK",
    communityId: "1",
    createdAt: new Date("2025-11-10"),
    upvotes: 15,
    downvotes: 2,
    status: "PENDING",
  },
  {
    id: "np2",
    labels: ["Person", "Researcher"],
    name: "Dr. Emily Chen",
    properties: [
      { key: "expertise", value: "Quantum Computing" },
      { key: "affiliation", value: "MIT" },
    ],
    userId: "u3",
    userName: "Isha Mehta",
    communityId: "1",
    createdAt: new Date("2025-11-11"),
    upvotes: 8,
    downvotes: 1,
    status: "PENDING",
  },
  {
    id: "np3",
    labels: ["Organization", "Startup"],
    name: "QuantumLeap AI",
    properties: [
      { key: "founded", value: "2024" },
      { key: "funding", value: "$5M Series A" },
    ],
    userId: "u2",
    userName: "Aarav Patel",
    communityId: "1",
    createdAt: new Date("2025-11-12"),
    upvotes: 12,
    downvotes: 3,
    status: "APPROVED",
  },
  {
    id: "np4",
    labels: ["Dataset"],
    name: "ImageNet-XL",
    properties: [
      { key: "size", value: "10M images" },
      { key: "type", value: "Computer Vision" },
    ],
    userId: "u4",
    userName: "Rohan Sharma",
    communityId: "1",
    createdAt: new Date("2025-11-09"),
    upvotes: 20,
    downvotes: 0,
    status: "PENDING",
  },
  {
    id: "np5",
    labels: ["Concept", "Algorithm"],
    name: "Adaptive Attention Mechanism",
    properties: [
      { key: "complexity", value: "O(n log n)" },
      { key: "use_case", value: "NLP and Vision Transformers" },
    ],
    userId: "u5",
    userName: "Sara Kapoor",
    communityId: "1",
    createdAt: new Date("2025-11-08"),
    upvotes: 6,
    downvotes: 4,
    status: "REJECTED",
  },
];

// ----------------------------
// Dummy Edge Proposals
// ----------------------------
export const dummyEdgeProposals: EdgeProposal[] = [
  {
    id: "ep1",
    type: "COLLABORATED_WITH",
    properties: [
      { key: "project", value: "Neural Architecture Search" },
      { key: "year", value: "2024" },
      { key: "duration", value: "6 months" },
    ],
    userId: "u1",
    userName: "Lakshay LK",
    communityId: "1",
    createdAt: new Date("2025-11-10"),
    upvotes: 11,
    downvotes: 1,
    status: "PENDING",
  },
  {
    id: "ep2",
    type: "CITED_BY",
    properties: [
      { key: "paper", value: "Attention Mechanisms in Deep Learning" },
      { key: "citations", value: "342" },
    ],
    userId: "u3",
    userName: "Isha Mehta",
    communityId: "1",
    createdAt: new Date("2025-11-11"),
    upvotes: 7,
    downvotes: 2,
    status: "PENDING",
  },
  {
    id: "ep3",
    type: "FUNDED_BY",
    properties: [
      { key: "amount", value: "$2M" },
      { key: "grant_type", value: "Research Grant" },
      { key: "date", value: "2025-01-15" },
    ],
    userId: "u2",
    userName: "Aarav Patel",
    communityId: "1",
    createdAt: new Date("2025-11-12"),
    upvotes: 14,
    downvotes: 0,
    status: "APPROVED",
  },
  {
    id: "ep4",
    type: "IMPLEMENTS",
    properties: [
      { key: "technology", value: "Transformer Architecture" },
      { key: "language", value: "PyTorch" },
    ],
    userId: "u4",
    userName: "Rohan Sharma",
    communityId: "1",
    createdAt: new Date("2025-11-09"),
    upvotes: 9,
    downvotes: 1,
    status: "PENDING",
  },
  {
    id: "ep5",
    type: "DERIVES_FROM",
    properties: [
      { key: "base_algorithm", value: "BERT" },
      { key: "modification", value: "Added multi-task learning" },
    ],
    userId: "u6",
    userName: "Vikram Nair",
    communityId: "1",
    createdAt: new Date("2025-11-13"),
    upvotes: 5,
    downvotes: 3,
    status: "PENDING",
  },
  {
    id: "ep6",
    type: "BASED_ON",
    properties: [
      { key: "dataset", value: "Common Crawl" },
      { key: "preprocessing", value: "Custom tokenization" },
    ],
    userId: "u5",
    userName: "Sara Kapoor",
    communityId: "1",
    createdAt: new Date("2025-11-07"),
    upvotes: 3,
    downvotes: 5,
    status: "REJECTED",
  },
];

