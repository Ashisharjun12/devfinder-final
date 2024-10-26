export async function initializeDb() {
  await db.collection('projects').createIndexes([
    { key: { userId: 1 } },
    { key: { status: 1 } },
    { key: { category: 1 } },
    { key: { title: "text", description: "text" } },
    { key: { updatedAt: -1 } }
  ]);
}
