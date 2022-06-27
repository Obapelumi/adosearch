/*
 * adosearch
 *
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AdosearchProvider {
  public static needsApplication = true

  constructor(protected app: ApplicationContract) {}

  public async register() {
    const Search = await (await import('../src/search')).default
    this.app.container.singleton('Adonis/Addons/Search', () => {
      const config = this.app.container.resolveBinding('Adonis/Core/Config').get('database', {})
      const Logger = this.app.container.resolveBinding('Adonis/Core/Logger')
      const Profiler = this.app.container.resolveBinding('Adonis/Core/Profiler')
      const Emitter = this.app.container.resolveBinding('Adonis/Core/Event')
      const { Database } = require('@adonisjs/lucid/build/src/Database')
      const DB = new Database(config, Logger, Profiler, Emitter)
      return Search(DB)
    })
  }
}
