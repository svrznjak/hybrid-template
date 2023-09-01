import type { App, ComponentOptions } from 'vue'
export default function registerGlobalComponents(app: App<Element>) {
  // Components
  const components = import.meta.glob('@/global/components/*.vue', { eager: true })
  // register all components
  Object.entries(components).forEach(([path, def]) => {
    // Get name of component, based on filename
    const componentName = path
      .split('/')
      .pop()
      ?.replace(/\.\w+$/, '')

    // Get component definition
    const definition = def as unknown as { default: ComponentOptions }
    // Register component on this Vue instance
    if (!componentName || !definition.default) return
    app.component(componentName, definition.default! as ComponentOptions)
  })
}
