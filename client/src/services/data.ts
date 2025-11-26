import type { Node, Edge, NodeProposal, EdgeProposal } from "../schema";


// ----------------------------
// Dummy Nodes
// ----------------------------
// Expanded Dummy Nodes (50)
// ----------------------------
export const dummyNodes: Node[] = [
  { id: "n1", labels: ["Person"], name: "Alice", properties: { age: 28, city: "New York" } },
  { id: "n2", labels: ["Person"], name: "Bob", properties: { age: 32, city: "London" } },
  { id: "n3", labels: ["Company"], name: "Techify Inc.", properties: { industry: "Software", founded: 2016 } },
  { id: "n4", labels: ["Project", "entity"], name: "NeuralVision", properties: { status: "Active", budget: 500000 } },
  { id: "n5", labels: ["Person"], name: "Charlie", properties: { age: 25, city: "San Francisco" } },
  { id: "n6", labels: ["Institution"], name: "Global University", properties: { location: "Boston", established: 1890 } },

  // --- Auto-generated Nodes Start Here ---
  ...Array.from({ length: 44 }).map((_, i) => {
    const idNum = i + 7;
    const roles = ["Person", "Company", "Project", "Institution", "Tool"];
    const randomLabel = roles[i % roles.length];

    return {
      id: `n${idNum}`,
      labels: [randomLabel],
      name:
        randomLabel === "Person"
          ? `User${idNum}`
          : randomLabel === "Company"
          ? `Company${idNum}`
          : randomLabel === "Project"
          ? `Project${idNum}`
          : randomLabel === "Institution"
          ? `Institute${idNum}`
          : `Tool${idNum}`,

      properties:
        randomLabel === "Person"
          ? {
              age: 20 + (i % 10),
              city: ["Delhi", "NY", "Berlin", "Tokyo"][i % 4]
            }
          : randomLabel === "Company"
          ? {
              industry: ["AI", "Finance", "Health", "Retail"][i % 4],
              founded: 2000 + (i % 20)
            }
          : randomLabel === "Project"
          ? {
              status: ["Active", "On Hold", "Completed"][i % 3],
              budget: 100000 + (i * 5000)
            }
          : randomLabel === "Institution"
          ? {
              location: ["Paris", "Mumbai", "Rome", "Seoul"][i % 4],
              established: 1800 + (i % 150)
            }
          : {
              version: `v${1 + (i % 5)}.${i % 10}`,
              license: ["MIT", "Apache", "GPL"][i % 3]
            },
    };
  })
];


// ----------------------------
// Dummy Edges
// ----------------------------
// Expanded Dummy Edges (100)
// ----------------------------
export const dummyEdges: Edge[] = [
  { id: "e1", sourceId: "n1", targetId: "n2", type: "FRIENDS_WITH", properties: { since: 2018, metAt: "Conference" } },
  { id: "e2", sourceId: "n1", targetId: "n3", type: "WORKS_AT", properties: { role: "Software Engineer", since: 2020 } },
  { id: "e3", sourceId: "n2", targetId: "n3", type: "INVESTED_IN", properties: { amount: 100000, currency: "USD" } },
  { id: "e4", sourceId: "n3", targetId: "n4", type: "OWNS", properties: { since: 2022, stake: "100%" } },
  { id: "e5", sourceId: "n5", targetId: "n4", type: "CONTRIBUTES_TO", properties: { role: "Data Scientist", hoursPerWeek: 20 } },

  // --- Auto-generated edges start here ---
  ...Array.from({ length: 95 }).map((_, i) => {
    const idNum = i + 6;
    return {
      id: `e${idNum}`,
      sourceId: `n${1 + (i % 50)}`,
      targetId: `n${1 + ((i * 7) % 50)}`,
      type: ["RELATES_TO", "CONNECTED_WITH", "MENTORS", "DEPENDS_ON", "USES"][i % 5],
      properties: {
        weight: (i % 10) + 1,
        createdAt: 2010 + (i % 15)
      }
    };
  })
];


// ----------------------------
// Dummy Node Proposals
// ----------------------------
export const dummyNodeProposals: NodeProposal[] = [
  {
    id: "np1",
    labels: ["Technology", "Artificial Intelligence", "ML"],
    name: "Machine Learning Framework",
    properties: {
      description: "A new ML framework for distributed training",
      version: "1.0.0",
    },
    userId: "u1",
    username: "Lakshay LK",
    communityId: "1",
    createdAt: new Date("2025-11-23"),
    upvotes: 15,
    downvotes: 2,
    status: "PENDING",
    proposalType: "CREATE",
  },
  {
    id: "np2",
    labels: ["Person", "Researcher"],
    name: "Dr. Emily Chen",
    properties: {
      expertise: "Quantum Computing",
      affiliation: "MIT",
    },
    userId: "u3",
    username: "Isha Mehta",
    communityId: "1",
    createdAt: new Date("2025-11-11"),
    upvotes: 8,
    downvotes: 1,
    status: "PENDING",
    proposalType: "UPDATE",
  },
  {
    id: "np3",
    labels: ["Organization", "Startup"],
    name: "QuantumLeap AI",
    properties: {
      founded: "2024",
      funding: "$5M Series A",
    },
    userId: "u2",
    username: "Aarav Patel",
    communityId: "1",
    createdAt: new Date("2025-11-12"),
    upvotes: 12,
    downvotes: 3,
    status: "APPROVED",
    proposalType: "CREATE",
  },
  {
    id: "np4",
    labels: ["Dataset"],
    name: "ImageNet-XL",
    properties: {
      size: "10M images",
      type: "Computer Vision",
    },
    userId: "u4",
    username: "Rohan Sharma",
    communityId: "1",
    createdAt: new Date("2025-11-09"),
    upvotes: 20,
    downvotes: 0,
    status: "PENDING",
    proposalType: "DELETE",
  },
  {
    id: "np5",
    labels: ["Concept", "Algorithm"],
    name: "Adaptive Attention Mechanism",
    properties: {
      complexity: "O(n log n)",
      use_case: "NLP and Vision Transformers",
    },
    userId: "u5",
    username: "Sara Kapoor",
    communityId: "1",
    createdAt: new Date("2025-11-08"),
    upvotes: 6,
    downvotes: 4,
    status: "REJECTED",
    proposalType: "UPDATE",
  },
];

// ----------------------------
// Dummy Edge Proposals
// ----------------------------
export const dummyEdgeProposals: EdgeProposal[] = [
  {
    id: "ep1",
    type: "COLLABORATED_WITH",
    properties: {
      project: "Neural Architecture Search",
      year: "2024",
      duration: "6 months",
    },
    userId: "u1",
    username: "Lakshay LK",
    communityId: "1",
    createdAt: new Date("2025-11-10"),
    upvotes: 11,
    downvotes: 1,
    status: "PENDING",
    sourceId: "n1",
    targetId: "n2",
    proposalType: "CREATE",
  },
  {
    id: "ep2",
    type: "CITED_BY",
    properties: {
      paper: "Attention Mechanisms in Deep Learning",
      citations: "342",
    },
    userId: "u3",
    username: "Isha Mehta",
    communityId: "1",
    createdAt: new Date("2025-11-11"),
    upvotes: 7,
    downvotes: 2,
    status: "PENDING",
    sourceId: "n3",
    targetId: "n4",
    proposalType: "CREATE",
  },
  {
    id: "ep3",
    type: "FUNDED_BY",
    properties: {
      amount: "$2M",
      grant_type: "Research Grant",
      date: "2025-01-15",
    },
    userId: "u2",
    username: "Aarav Patel",
    communityId: "1",
    createdAt: new Date("2025-11-12"),
    upvotes: 14,
    downvotes: 0,
    status: "APPROVED",
    sourceId: "n5",
    targetId: "n6",
    proposalType: "CREATE",
  },
  {
    id: "ep4",
    type: "IMPLEMENTS",
    properties: {
      technology: "Transformer Architecture",
      language: "PyTorch",
    },
    userId: "u4",
    username: "Rohan Sharma",
    communityId: "1",
    createdAt: new Date("2025-11-09"),
    upvotes: 9,
    downvotes: 1,
    status: "PENDING",
    sourceId: "n2",
    targetId: "n7",
    proposalType: "CREATE",
  },
  {
    id: "ep5",
    type: "DERIVES_FROM",
    properties: {
      base_algorithm: "BERT",
      modification: "Added multi-task learning",
    },
    userId: "u6",
    username: "Vikram Nair",
    communityId: "1",
    createdAt: new Date("2025-11-13"),
    upvotes: 5,
    downvotes: 3,
    status: "PENDING",
    sourceId: "n8",
    targetId: "n9",
    proposalType: "CREATE",
  },
  {
    id: "ep6",
    type: "BASED_ON",
    properties: {
      dataset: "Common Crawl",
      preprocessing: "Custom tokenization",
    },
    userId: "u5",
    username: "Sara Kapoor",
    communityId: "1",
    createdAt: new Date("2025-11-07"),
    upvotes: 3,
    downvotes: 5,
    status: "REJECTED",
    sourceId: "n10",
    targetId: "n11",
    proposalType: "CREATE",
  },
  // NEW EXTRA PROPOSALS
  {
    id: "ep7",
    type: "EXTENDS",
    properties: {
      parent_model: "GPT-4",
      extension: "Added multilingual capabilities",
    },
    userId: "u7",
    username: "Priya Verma",
    communityId: "2",
    createdAt: new Date("2025-11-14"),
    upvotes: 12,
    downvotes: 0,
    status: "PENDING",
    sourceId: "n12",
    targetId: "n13",
    proposalType: "CREATE",
  },
  {
    id: "ep8",
    type: "EVALUATED_ON",
    properties: {
      metric: "Accuracy",
      score: "92%",
    },
    userId: "u8",
    username: "Kabir Singh",
    communityId: "2",
    createdAt: new Date("2025-11-15"),
    upvotes: 4,
    downvotes: 1,
    status: "PENDING",
    sourceId: "n14",
    targetId: "n15",
    proposalType: "CREATE",
  },
  {
    id: "ep9",
    type: "OPTIMIZED_WITH",
    properties: {
      optimizer: "AdamW",
      learning_rate: "2e-5",
    },
    userId: "u9",
    username: "Harshit Gupta",
    communityId: "1",
    createdAt: new Date("2025-11-16"),
    upvotes: 2,
    downvotes: 0,
    status: "PENDING",
    sourceId: "n16",
    targetId: "n17",
    proposalType: "UPDATE",
  },
  {
    id: "ep10",
    type: "RELATED_TO",
    properties: {
      relation_strength: "High",
      reason: "Shared training pipeline",
    },
    userId: "u10",
    username: "Aditi Rao",
    communityId: "3",
    createdAt: new Date("2025-11-17"),
    upvotes: 10,
    downvotes: 2,
    status: "APPROVED",
    sourceId: "n18",
    targetId: "n19",
    proposalType: "DELETE",
  },
];
