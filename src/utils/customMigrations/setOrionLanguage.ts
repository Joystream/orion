import { EntityManager } from 'typeorm'
import { globalEm } from '../globalEm'
import { predictVideoLanguage } from '../language'

async function detectVideoLanguage() {
  const em: EntityManager = await globalEm
  const videos: any[] = await em.query(`
    SELECT id, title, description
    FROM admin.video
  `)

  // Temporary storage for batch update data
  const updates: any[] = []

  for (const [i, video] of videos.entries()) {
    const orionLanguage = predictVideoLanguage({
      title: video.title,
      description: video.description,
    })

    // Instead of updating immediately, push the update data into the array
    updates.push({ orionLanguage, id: video.id })
    console.log(i)
  }

  // Define batch size
  const batchSize = 1000 // Adjust the batch size based on your database and network performance

  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize)

    // Prepare the query and parameters for batch update
    const query = `
      UPDATE admin.video AS v SET
        orion_language = c.orion_language
      FROM (VALUES ${batch
        .map((_, idx) => `($${idx * 2 + 1}, $${idx * 2 + 2})`)
        .join(',')}) AS c(orion_language, id)
      WHERE c.id = v.id;
    `

    const queryParams = batch.flatMap((update) => [update.orionLanguage, update.id])

    // Execute batch update
    await em.query(query, queryParams)
  }

  console.log(`Updated languages for ${videos.length} videos`)
}

detectVideoLanguage()
  .then(() => console.log('Update process completed.'))
  .catch(() => {
    console.error('process failed')
    process.exit(1)
  })
