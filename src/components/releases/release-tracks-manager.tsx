"use client";

import { useState } from "react";
import { Music4, PencilLine, Plus } from "lucide-react";

import { TrackForm } from "@/components/forms/track-form";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { trackStatusLabels, type trackStatusValues } from "@/lib/domain-config";
import { getStatusVariant } from "@/lib/presentation";
import { formatDurationSeconds } from "@/lib/utils";
import { DeleteTrackButton } from "@/components/releases/delete-track-button";

type ReleaseTrack = {
  id: string;
  title: string;
  durationSeconds: number | null;
  isrc: string | null;
  versionName: string | null;
  status: (typeof trackStatusValues)[number];
};

type ReleaseTracksManagerProps = {
  releaseId: string;
  tracks: ReleaseTrack[];
};

export function ReleaseTracksManager({
  releaseId,
  tracks
}: ReleaseTracksManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTrackId, setEditingTrackId] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader className="border-b border-border/60 pb-5">
        <SectionHeader
          title="Tracks"
          description="Build out the release one track at a time, with delivery metadata ready for distribution and campaign planning."
          actions={
            <Button onClick={() => setIsAdding((current) => !current)}>
              <Plus className="size-4" />
              {isAdding ? "Close" : "Add track"}
            </Button>
          }
        />
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {isAdding ? (
          <TrackForm
            releaseId={releaseId}
            onCancel={() => setIsAdding(false)}
            onSaved={() => {
              setIsAdding(false);
            }}
          />
        ) : null}

        {tracks.length === 0 ? (
          <EmptyState
            title="No tracks added yet"
            description="Add the first track to capture runtime, ISRC, and delivery status before release day arrives."
            icon={Music4}
            variant="card"
            action={
              <Button onClick={() => setIsAdding(true)}>
                <Plus className="size-4" />
                Add first track
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {tracks.map((track, index) => {
              const isEditing = editingTrackId === track.id;

              return (
                <div
                  key={track.id}
                  className="rounded-2xl border border-border/70 bg-background/45 p-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex size-9 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-foreground">{track.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {track.versionName ?? "Original version"}
                          </p>
                        </div>
                        <Badge variant={getStatusVariant(track.status)}>
                          {trackStatusLabels[track.status]}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                        <span>Duration: {formatDurationSeconds(track.durationSeconds)}</span>
                        <span>ISRC: {track.isrc ?? "Not set"}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEditingTrackId((current) =>
                            current === track.id ? null : track.id
                          )
                        }
                      >
                        <PencilLine className="size-4" />
                        {isEditing ? "Close" : "Edit"}
                      </Button>
                      <DeleteTrackButton
                        releaseId={releaseId}
                        trackId={track.id}
                        trackTitle={track.title}
                      />
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="mt-4">
                      <TrackForm
                        releaseId={releaseId}
                        track={track}
                        onCancel={() => setEditingTrackId(null)}
                        onSaved={() => setEditingTrackId(null)}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
