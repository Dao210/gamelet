import { GetServerSideProps } from 'next'

function generateRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: https://nerdle-math-game.vercel.app/sitemap.xml

# Crawl-delay for polite crawling
Crawl-delay: 1

# Allow all search engines to index the site
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /
`
}

function RobotsTxt() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const robotsTxt = generateRobotsTxt()

  res.setHeader('Content-Type', 'text/plain')
  res.write(robotsTxt)
  res.end()

  return {
    props: {},
  }
}

export default RobotsTxt
