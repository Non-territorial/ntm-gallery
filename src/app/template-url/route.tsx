/* eslint-disable max-len */
import { NextResponse } from 'next/server';

const REQUIRE_ENV_VARS = false;

const TITLE = 'NTM Gallery';
const DESCRIPTION = 'Nonterritorial Marketplace';
const REPO_TEAM = 'Nonterritorial';
const REPO_NAME = 'ntm-gallery';

export function GET() {
  const url = new URL('https://vercel.com/new/clone');

  url.searchParams.set('demo-title', TITLE);
  url.searchParams.set('demo-description', DESCRIPTION);
  url.searchParams.set('demo-url', 'https://ntm-gallery.xyz');
  url.searchParams.set('demo-description', DESCRIPTION);
  url.searchParams.set('demo-image', 'https://photos.sambecker.com/template-image-tight');
  url.searchParams.set('project-name', TITLE);
  url.searchParams.set('repository-name', REPO_NAME);
  url.searchParams.set('repository-url', `https://github.com/Non-territorial/ntm-gallery.git`);
  url.searchParams.set('from', 'templates');
  url.searchParams.set('skippable-integrations', '1');
  if (REQUIRE_ENV_VARS) {
    url.searchParams.set('env-description', 'Configure your photo blog meta');
    url.searchParams.set('env-link', 'BLANK');
    url.searchParams.set('env', [
      'NEXT_PUBLIC_SITE_TITLE',
    ].join(','));
  }
  url.searchParams.set('teamCreateStatus', 'hidden');
  url.searchParams.set('stores', JSON.stringify([
    { type: 'postgres' },
    { type: 'blob' },
  ]));

  return NextResponse.json(url.toString());
}
