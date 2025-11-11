import type { Community, Post, User, Node, Edge } from "../schema";

// dummy communities data
export const communities:Community[] = [
  {
    id: '1',
    title: 'AI Enthusiasts',
    description: 'A community for those interested in artificial intelligence and machine learning.',
    ownerId: 'u1',
    createdAt: new Date(),
    owner: { id: 'u1', username: 'Lakshay LK', createdAt: new Date() },
    members: [
      { id: 'u1', username: 'Lakshay LK', createdAt: new Date() },
      { id: 'u2', username: 'Aarav Patel', createdAt: new Date() },
      {id: '1', username: 'John Doe', createdAt: new Date()}
    ],
    posts: [],
    reputation: 124,
  },
  {
    id: '2',
    title: 'Health and Wellness',
    description: 'Discuss and share tips about health, fitness, and wellness.',
    ownerId: 'u5',
    createdAt: new Date(),
    owner: { id: 'u5', username: 'Sara Kapoor', createdAt: new Date() },
    members: [
      { id: 'u5', username: 'Sara Kapoor', createdAt: new Date() },
      { id: 'u2', username: 'Aarav Patel', createdAt: new Date() },
    ],
    posts: [],
    reputation: 86,
  },
  {
    id: '3',
    title: 'Climate Change Advocates',
    description: 'Join us in the fight against climate change and environmental degradation.',
    ownerId: 'u6',
    createdAt: new Date(),
    owner: { id: 'u6', username: 'Vikram Nair', createdAt: new Date() },
    members: [
      { id: 'u6', username: 'Vikram Nair', createdAt: new Date() },
    ],
    posts: [],
    reputation: 72,
  },
  {
    id: '4',
    title: 'Web Development',
    description: 'A community for web developers to share resources and discuss best practices.',
    ownerId: 'u4',
    createdAt: new Date(),
    owner: { id: 'u4', username: 'Rohan Sharma', createdAt: new Date() },
    members: [
      { id: 'u4', username: 'Rohan Sharma', createdAt: new Date() },
      { id: 'u3', username: 'Isha Mehta', createdAt: new Date() },
    ],
    posts: [],
    reputation: 210,
  },
  {
    id: '5',
    title: 'Cybersecurity',
    description: 'Join us to discuss the latest trends and challenges in cybersecurity.',
    ownerId: 'u2',
    createdAt: new Date(),
    owner: { id: 'u2', username: 'Aarav Patel', createdAt: new Date() },
    members: [
      { id: 'u2', username: 'Aarav Patel', createdAt: new Date() },
      { id: 'u6', username: 'Vikram Nair', createdAt: new Date() },
    ],
    posts: [],
    reputation: 95,
  },
  {
    id: '6',
    title: 'Data Science',
    description: 'A community for data scientists to share insights and resources.',
    ownerId: 'u1',
    createdAt: new Date(),
    owner: { id: 'u1', username: 'Lakshay LK', createdAt: new Date() },
    members: [
      { id: 'u1', username: 'Lakshay LK', createdAt: new Date() },
      { id: 'u3', username: 'Isha Mehta', createdAt: new Date() },
    ],
    posts: [],
    reputation: 178,
  },
  {
    id: '7',
    title: 'Blockchain Technology',
    description: 'Discuss the latest trends and developments in blockchain technology.',
    ownerId: 'u5',
    createdAt: new Date(),
    owner: { id: 'u5', username: 'Sara Kapoor', createdAt: new Date() },
    members: [
      { id: 'u5', username: 'Sara Kapoor', createdAt: new Date() },
      { id: 'u6', username: 'Vikram Nair', createdAt: new Date() },
    ],
    posts: [],
    reputation: 143,
  },
];

export const users: User[] = [
  { id: "u1", username: "Lakshay LK", createdAt: new Date()},
  { id: "u2", username: "Aarav Patel", createdAt: new Date()},
  { id: "u3", username: "Isha Mehta", createdAt: new Date()},
  { id: "u4", username: "Rohan Sharma", createdAt: new Date()},
  { id: "u5", username: "Sara Kapoor", createdAt: new Date()},
  { id: "u6", username: "Vikram Nair", createdAt: new Date()},
];

export const posts: Post[] = [
  // AI Enthusiasts
  {
    id: "p1",
    title: "How Transformers Revolutionized AI",
    content:
      "Transformers changed the landscape of AI with self-attention mechanisms. Let's discuss their evolution and applications!",
    authorId: "u1",
    communityId: communities[0].id,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: users[0],
    comments: [
      {
        id: "c1",
        postId: "p1",
        userId: "u2",
        content: "Totally agree! The 'Attention is All You Need' paper was a game changer.",
        createdAt: new Date(),
        user: users[1],
        replies: [
          {
            id: "c1-1",
            postId: "p1",
            userId: "u1",
            content: "Exactly, and now it's the backbone of ChatGPT and similar models.",
            createdAt: new Date(),
            parentCommentId: "c1",
            user: users[0],
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: "p2",
    title: "Best Datasets for Computer Vision Projects",
    content:
      "What are your favorite datasets for experimenting with image classification or segmentation?",
    authorId: "u3",
    communityId: communities[0].id,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: users[2],
    comments: [
      {
        id: "c2",
        postId: "p2",
        userId: "u4",
        content: "COCO and ImageNet are classics, but I love smaller ones like Oxford Pets.",
        createdAt: new Date(),
        user: users[3],
        replies: [],
      },
    ],
  },

  // Health and Wellness
  {
    id: "p3",
    title: "Morning Routine Tips for Productivity",
    content:
      "Starting your day with meditation and hydration can boost energy levels. What’s your routine?",
    authorId: "u5",
    communityId: communities[1].id,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: users[4],
    comments: [
      {
        id: "c3",
        postId: "p3",
        userId: "u2",
        content: "I swear by a 15-minute yoga session every morning!",
        createdAt: new Date(),
        user: users[1],
        replies: [],
      },
    ],
  },

  // Climate Change Advocates
  {
    id: "p4",
    title: "Reducing Plastic Waste in Daily Life",
    content:
      "Small actions like using metal bottles and cloth bags make a huge difference. Share your ideas!",
    authorId: "u6",
    communityId: communities[2].id,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: users[5],
    comments: [],
  },

  // Web Development
  {
    id: "p5",
    title: "Best Frontend Framework in 2025?",
    content:
      "React, Vue, Svelte, or SolidJS? Which one do you think will dominate frontend dev this year?",
    authorId: "u4",
    communityId: communities[3].id,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: users[3],
    comments: [
      {
        id: "c5",
        postId: "p5",
        userId: "u3",
        content: "React still leads, especially with server components becoming mainstream.",
        createdAt: new Date(),
        user: users[2],
        replies: [],
      },
    ],
  },

  // Cybersecurity
  {
    id: "p6",
    title: "How to Stay Safe from Phishing Attacks",
    content:
      "Phishing emails are getting more sophisticated. Let's share quick tips on identifying them!",
    authorId: "u2",
    communityId: communities[4].id,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: users[1],
    comments: [
      {
        id: "c6",
        postId: "p6",
        userId: "u6",
        content: "Always hover over links before clicking and check sender domains.",
        createdAt: new Date(),
        user: users[5],
        replies: [],
      },
    ],
  },

  // Data Science
  {
    id: "p7",
    title: "Top Python Libraries for Data Science in 2025",
    content:
      "Apart from Pandas and NumPy, libraries like Polars and PyCaret are getting a lot of attention!",
    authorId: "u1",
    communityId: communities[5].id,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: users[0],
    comments: [
      {
        id: "c7",
        postId: "p7",
        userId: "u3",
        content: "PyCaret makes experimentation so much easier. Love it.",
        createdAt: new Date(),
        user: users[2],
        replies: [],
      },
    ],
  },

  // Blockchain Technology
  {
    id: "p8",
    title: "Ethereum 3.0 — What’s Next?",
    content:
      "With Ethereum moving toward more efficient consensus models, what future do you see for DeFi?",
    authorId: "u5",
    communityId: communities[6].id,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: users[4],
    comments: [
      {
        id: "c8",
        postId: "p8",
        userId: "u6",
        content: "DeFi is maturing fast, but regulation will shape its future heavily.",
        createdAt: new Date(),
        user: users[5],
        replies: [],
      },
    ],
  },
];

// ----------------------------
// Dummy Nodes
// ----------------------------
export const dummyNodes: Node[] = [
  {
    id: "n1",
    labels: ["Person"],
    properties: [
      { key: "name", value: "Alice" },
      { key: "age", value: 28 },
      { key: "city", value: "New York" },
    ],
  },
  {
    id: "n2",
    labels: ["Person"],
    properties: [
      { key: "name", value: "Bob" },
      { key: "age", value: 32 },
      { key: "city", value: "London" },
    ],
  },
  {
    id: "n3",
    labels: ["Company"],
    properties: [
      { key: "name", value: "Techify Inc." },
      { key: "industry", value: "Software" },
      { key: "founded", value: 2016 },
    ],
  },
  {
    id: "n4",
    labels: ["Project", "entity"],
    properties: [
      { key: "name", value: "NeuralVision" },
      { key: "status", value: "Active" },
      { key: "budget", value: 500000 },
    ],
  },
  {
    id: "n5",
    labels: ["Person"],
    properties: [
      { key: "name", value: "Charlie" },
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
