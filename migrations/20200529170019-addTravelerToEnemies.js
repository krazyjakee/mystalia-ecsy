module.exports = {
  async up(db, client) {
    await db.collection("enemies").updateMany(
      {},
      {
        $set: {
          traveler: false,
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
