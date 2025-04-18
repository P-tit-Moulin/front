/* eslint-disable no-undef */
import { Octokit } from '@octokit/rest'
import axios from 'axios'

// Variables d'environnement
const githubToken = process.env.GITHUB_TOKEN
const openaiApiKey = process.env.OPENAI_API_KEY

const octokit = new Octokit({ auth: githubToken })

async function run() {
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/')
  const pull_number = process.env.GITHUB_REF.split('/').pop()

  // 1. Récupérer les commits de la PR
  const commitsRes = await octokit.pulls.listCommits({
    owner,
    repo,
    pull_number,
  })

  const commitMessages = commitsRes.data
    .map((commit) => `- ${commit.commit.message}`)
    .join('\n')

  // 2. Récupérer le diff de la PR
  const prRes = await octokit.request(
    `GET /repos/${owner}/${repo}/pulls/${pull_number}`,
    {
      owner,
      repo,
      pull_number,
      headers: {
        accept: 'application/vnd.github.v3.diff',
      },
    }
  )

  const diff = prRes.data

  // 3. Créer un prompt pour GPT
  const prompt = `
Voici la liste des commits d'une Pull Request :

${commitMessages}

Et voici le diff associé :

${diff.slice(0, 5000)}

Peux-tu générer une description claire et concise pour cette PR en français ? Résume les changements principaux.
`

  // 4. Appel OpenAI API
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant pour décrire des Pull Requests.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 400,
      temperature: 0.5,
    },
    {
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
    }
  )

  const generatedDescription = response.data.choices[0].message.content.trim()

  // 5. Mettre à jour la description de la PR
  await octokit.pulls.update({
    owner,
    repo,
    pull_number,
    body: generatedDescription,
  })

  console.log('✅ Description mise à jour !')
}

run().catch((err) => {
  console.error('❌ Erreur :', err.message)
  process.exit(1)
})
