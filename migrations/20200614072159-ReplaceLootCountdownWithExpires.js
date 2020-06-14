module.exports = {
  async up(db, client) {
    await db.collection("loots").updateMany(
      {},
      {
        $set: {
          expires: 0,
        },
      }
    );
  },

  async down(db, client) {
    await db.collection("loots").updateMany(
      {},
      {
        $unset: {
          countdown: 0,
        },
      }
    );
  },
};
