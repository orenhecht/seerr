import AirDateBadge from '@app/components/AirDateBadge';
import Badge from '@app/components/Common/Badge';
import LoadingSpinner from '@app/components/Common/LoadingSpinner';
import globalMessages from '@app/i18n/globalMessages';
import defineMessages from '@app/utils/defineMessages';
import { MediaRequestStatus, MediaStatus } from '@server/constants/media';
import type EpisodeRequest from '@server/entity/EpisodeRequest';
import type { SeasonWithEpisodes } from '@server/models/Tv';
import { useIntl } from 'react-intl';
import useSWR from 'swr';

const messages = defineMessages('components.RequestModal.EpisodeSelector', {
  episode: 'Episode {episodeNumber}',
  loading: 'Loading episodes...',
  selected: 'Selected',
  unavailable: 'Episode list unavailable.',
});

type EpisodeSelectorProps = {
  tvId: number;
  seasonNumber: number;
  selectedEpisodes: number[];
  requestedEpisodes: EpisodeRequest[];
  seasonStatus?: MediaStatus;
  isSeasonSelected: boolean;
  isSeasonBlocked: boolean;
  onToggleEpisode: (episodeNumber: number) => void;
};

const EpisodeSelector = ({
  tvId,
  seasonNumber,
  selectedEpisodes,
  requestedEpisodes,
  seasonStatus,
  isSeasonSelected,
  isSeasonBlocked,
  onToggleEpisode,
}: EpisodeSelectorProps) => {
  const intl = useIntl();
  const { data, error } = useSWR<SeasonWithEpisodes>(
    `/api/v1/tv/${tvId}/season/${seasonNumber}`
  );

  if (!data && !error) {
    return (
      <div className="flex items-center justify-center py-6 text-sm text-gray-300">
        <LoadingSpinner />
        <span className="ml-2">{intl.formatMessage(messages.loading)}</span>
      </div>
    );
  }

  if (!data || data.episodes.length === 0) {
    return (
      <p className="px-4 py-4 text-sm text-gray-300">
        {intl.formatMessage(messages.unavailable)}
      </p>
    );
  }

  return (
    <div className="divide-y divide-gray-700 bg-gray-900/70">
      {data.episodes.map((episode) => {
        const requestedEpisode = requestedEpisodes.find(
          (request) => request.episodeNumber === episode.episodeNumber
        );
        const selected = selectedEpisodes.includes(episode.episodeNumber);
        const disabled =
          isSeasonSelected ||
          isSeasonBlocked ||
          !!requestedEpisode ||
          seasonStatus === MediaStatus.AVAILABLE;

        return (
          <div
            key={`season-${seasonNumber}-episode-${episode.episodeNumber}`}
            className="grid grid-cols-[4rem_1fr_auto] gap-3 px-4 py-3 text-sm text-gray-200 md:grid-cols-[5rem_1fr_8rem]"
          >
            <div className="flex items-start pt-1">
              <span
                role="checkbox"
                tabIndex={disabled ? -1 : 0}
                aria-checked={selected || !!requestedEpisode}
                onClick={() =>
                  !disabled && onToggleEpisode(episode.episodeNumber)
                }
                onKeyDown={(e) => {
                  if (!disabled && (e.key === 'Enter' || e.key === 'Space')) {
                    onToggleEpisode(episode.episodeNumber);
                  }
                }}
                className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center pt-2 focus:outline-none ${
                  disabled ? 'opacity-50' : ''
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`${
                    selected || !!requestedEpisode
                      ? 'bg-indigo-500'
                      : 'bg-gray-700'
                  } absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out`}
                />
                <span
                  aria-hidden="true"
                  className={`${
                    selected || !!requestedEpisode
                      ? 'translate-x-5'
                      : 'translate-x-0'
                  } absolute left-0 inline-block h-5 w-5 rounded-full border border-gray-200 bg-white shadow transition-transform duration-200 ease-in-out group-focus:border-blue-300 group-focus:ring`}
                />
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-gray-100">
                  {intl.formatMessage(messages.episode, {
                    episodeNumber: episode.episodeNumber,
                  })}
                </span>
                <span className="truncate">{episode.name}</span>
                {episode.airDate && <AirDateBadge airDate={episode.airDate} />}
              </div>
              {episode.overview && (
                <p className="mt-1 text-gray-400">{episode.overview}</p>
              )}
            </div>
            <div className="flex items-start justify-end pt-1">
              {requestedEpisode?.status === MediaRequestStatus.PENDING ? (
                <Badge badgeType="warning">
                  {intl.formatMessage(globalMessages.pending)}
                </Badge>
              ) : requestedEpisode?.status === MediaRequestStatus.APPROVED ? (
                <Badge badgeType="primary">
                  {intl.formatMessage(globalMessages.requested)}
                </Badge>
              ) : selected ? (
                <Badge badgeType="primary">
                  {intl.formatMessage(messages.selected)}
                </Badge>
              ) : (
                <Badge>{intl.formatMessage(globalMessages.notrequested)}</Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EpisodeSelector;
