module.exports = {
  async up(db, client) {
    await db.collection("enemies").updateMany(
      { enemyId: 5 },
      {
        $set: {
          traveler: true,
        },
      }
    );
  },

  async down(db, client) {
    await db.collection("enemies").updateMany(
      {},
      {
        $unset: {
          traveler: false,
        },
      }
    );
  },
};
