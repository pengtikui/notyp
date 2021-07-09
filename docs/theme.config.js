export default {
  repository: 'https://github.com/pengtikui/notyp',
  docsRepository: 'https://github.com/pengtikui/notyp',
  branch: 'master',
  path: 'docs',
  titleSuffix: ' - Notyp',
  nextLinks: true,
  prevLinks: true,
  search: true,
  darkMode: true,
  logo: (
    <>
      <span class="text-lg mr-2 font-extrabold hidden md:inline">Notyp</span>
      <span class="text-gray-600 font-normal hidden md:inline">一个简洁的 Node.js 框架</span>
    </>
  ),
  footer: true,
  footerText: `Copyright © ${new Date().getFullYear()} Paranoid_K`,
  footerEditOnGitHubLink: true,
  i18n: [{ locale: 'zh-CN', text: '简体中文' }],
};
