import { addColumns, schemaMigrations } from "@nozbe/watermelondb/Schema/migrations";

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: 'players',
          columns: [
            { name: 'created_at', type: 'number' }
          ]
        })
      ]
    }
  ]
});