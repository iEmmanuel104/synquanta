import { Service } from '../types';

/**
 * Display order matters: the home-page teaser shows the first three and the
 * footer the first five.
 */
export const services: Service[] = [
  {
    id: 'web-development',
    icon: 'Globe',
    illustration: '/illustrations/web-development.svg',
    title: 'Web Application Development',
    description:
      'Web apps and platforms that stay quick as the data grows and the user count climbs.',
  },
  {
    id: 'custom-erp',
    icon: 'LayoutDashboard',
    illustration: '/illustrations/custom-erp.svg',
    title: 'Custom ERP Systems',
    description:
      'Inventory, finance, HR, procurement and reporting in one system, built around how your business actually works instead of forcing it into an off-the-shelf mould.',
  },
  {
    id: 'ai-systems',
    icon: 'Brain',
    illustration: '/illustrations/ai-systems.svg',
    title: 'AI Systems & Agents',
    description:
      'Bespoke AI agents and decision systems that take on a real job end to end, grounded in your own data and measured on whether they earn their keep.',
  },
  {
    id: 'mobile-development',
    icon: 'Smartphone',
    illustration: '/illustrations/mobile-development.svg',
    title: 'Mobile Application Development',
    description:
      'iOS and Android apps, native or cross-platform, built to the standard people expect from an app they paid for.',
  },
  {
    id: 'ai-integrations',
    icon: 'Plug',
    illustration: '/illustrations/ai-integrations.svg',
    title: 'AI Integrations',
    description:
      'Language models, copilots and automation wired into the tools you already run, so AI helps where the work happens rather than in yet another tab.',
  },
  {
    id: 'custom-software',
    icon: 'Code',
    illustration: '/illustrations/custom-software.svg',
    title: 'Custom Software & Platforms',
    description:
      'Software written for the way your business actually runs, rather than the way a generic tool assumes it does.',
  },
  {
    id: 'system-architecture',
    icon: 'Network',
    illustration: '/illustrations/system-architecture.svg',
    title: 'System Architecture & Consulting',
    description:
      'Help with the decisions that are expensive to reverse later: architecture, infrastructure, and what to build in-house.',
  },
  {
    id: 'blockchain',
    icon: 'Blocks',
    illustration: '/illustrations/blockchain.svg',
    title: 'Blockchain & Distributed Systems',
    description:
      'Smart contracts and decentralised apps, written carefully, because on-chain mistakes are permanent.',
  },
];
