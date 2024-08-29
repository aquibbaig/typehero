import { auth } from '~/server/auth';

import { TrackDetail } from '../_components/track-details';
import { getTrackDetails } from '../_components/track.action';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: Props) {
  const session = await auth();

  return <TrackDetail slug={params.slug} />;
}

export async function generateMetadata({ params: { slug } }: Props) {
  const track = await getTrackDetails(slug);

  if (!track) {
    return {
      title: 'Track | TypeHero',
      description: 'View the details of this track on TypeHero.',
    };
  }

  return {
    title: `${track.name} Track | TypeHero`,
    description: `View the details of the ${track.name} track on TypeHero. ${track.description}`,
  };
}