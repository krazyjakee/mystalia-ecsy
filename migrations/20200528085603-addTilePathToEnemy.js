module.exports = {
  async up(db, client) {
    await db.collection("enemies").updateMany(
      {},
      {
        $set: {
          tilePath: [],
        },
      }
    );
  },

  async down(db, client) {
    await db.collection("enemies").updateMany(
      {},
      {
        $unset: {
          tilePath: [],
        },
      }
    );
  },
};
