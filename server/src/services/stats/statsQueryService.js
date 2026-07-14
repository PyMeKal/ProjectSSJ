export async function countMessagesBySender(db, whereSql, replacements = {}) {
  // Raw SQL keeps percentage analysis simple and avoids loading hundreds of thousands of rows.
  const rows = await db.sequelize.query(
    `
      select sender, count(*) as count
      from texts
      ${whereSql}
      group by sender
      order by count desc, sender asc
    `,
    {
      replacements,
      type: db.Sequelize.QueryTypes.SELECT,
    },
  );

  return rows.map((row) => ({
    sender: row.sender,
    count: Number(row.count),
  }));
}
