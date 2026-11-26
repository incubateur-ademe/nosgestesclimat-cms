import { createRequire } from 'node:module'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'


const require = createRequire(import.meta.url)

try {
  const root = process.cwd()
  const pnpmDir = resolve(root, 'node_modules/.pnpm')

  const glibc = process.report?.getReport?.().header?.glibcVersionRuntime
  console.log('[swc] runtime', {
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    libc: glibc ? `glibc ${glibc}` : 'musl/unknown',
    NODE_ENV: process.env.NODE_ENV,
  })

  try {
    console.log('[swc] ldd mentions musl:', readFileSync('/usr/bin/ldd', 'utf-8').includes('musl'))
  } catch (error) {
    console.log('[swc] /usr/bin/ldd unreadable:', error.code)
  }

  if (!existsSync(pnpmDir)) {
    console.log('[swc] no', pnpmDir)
    process.exit(0)
  }

  const swcDirs = readdirSync(pnpmDir).filter((dir) => dir.startsWith('@swc+'))
  console.log('[swc] installed @swc packages:', swcDirs)

  const coreDir = swcDirs.find((dir) => dir.startsWith('@swc+core@'))
  if (!coreDir) {
    console.log('[swc] @swc/core is missing from the virtual store')
    process.exit(0)
  }

  const swcScopeDir = resolve(pnpmDir, coreDir, 'node_modules/@swc')
  for (const entry of readdirSync(swcScopeDir)) {
    const target = resolve(swcScopeDir, entry)
    const binary = existsSync(target) && readdirSync(target).find((f) => f.endsWith('.node'))
    console.log(
      '[swc] linked:',
      entry,
      binary ? `${binary} ${statSync(resolve(target, binary)).size}B` : 'no .node file'
    )
  }

  try {
    require(resolve(swcScopeDir, 'core'))
    console.log('[swc] native binding loads fine')
  } catch (error) {
    console.log('[swc]', error.message)
    for (const cause of error.cause ?? []) {
      console.log('[swc]   cause:', cause.code, cause.message)
    }
  }
} catch (error) {
  console.log('[swc] diagnostic failed:', error)
}
