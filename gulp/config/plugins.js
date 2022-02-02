import replace from 'gulp-replace'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import browsersync from 'browser-sync'
import newer from 'gulp-newer'
import gulpIf from 'gulp-if'

export const plugins = {
  replace,
  plumber,
  notify,
  browsersync,
  newer,
  if: gulpIf,
}
