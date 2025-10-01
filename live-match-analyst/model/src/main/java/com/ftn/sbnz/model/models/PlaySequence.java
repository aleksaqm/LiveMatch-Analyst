package com.ftn.sbnz.model.models;

import java.util.ArrayList;
import java.util.List;

public class PlaySequence {
    private Long scoringPlayerId;
    private Long scoringTeamId;
    private Long initiatingPlayerId;
    private List<Long> playerChain;
    private int chainLength;
    private long timestamp;

    public PlaySequence() {
        this.playerChain = new ArrayList<>();
    }

    public PlaySequence(Long scoringPlayerId, Long scoringTeamId, long timestamp) {
        this.scoringPlayerId = scoringPlayerId;
        this.scoringTeamId = scoringTeamId;
        this.timestamp = timestamp;
        this.playerChain = new ArrayList<>();
        this.playerChain.add(scoringPlayerId);
        this.chainLength = 1;
    }

    public void prependPlayer(Long playerId) {
        this.playerChain.add(0, playerId);
        this.initiatingPlayerId = playerId;
        this.chainLength = this.playerChain.size();
    }

    public Long getScoringPlayerId() {
        return scoringPlayerId;
    }

    public void setScoringPlayerId(Long scoringPlayerId) {
        this.scoringPlayerId = scoringPlayerId;
    }

    public Long getScoringTeamId() {
        return scoringTeamId;
    }

    public void setScoringTeamId(Long scoringTeamId) {
        this.scoringTeamId = scoringTeamId;
    }

    public Long getInitiatingPlayerId() {
        return initiatingPlayerId;
    }

    public void setInitiatingPlayerId(Long initiatingPlayerId) {
        this.initiatingPlayerId = initiatingPlayerId;
    }

    public List<Long> getPlayerChain() {
        return playerChain;
    }

    public void setPlayerChain(List<Long> playerChain) {
        this.playerChain = playerChain;
    }

    public int getChainLength() {
        return chainLength;
    }

    public void setChainLength(int chainLength) {
        this.chainLength = chainLength;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "PlaySequence{" +
                "scoringPlayer=" + scoringPlayerId +
                ", initiatingPlayer=" + initiatingPlayerId +
                ", chainLength=" + chainLength +
                ", chain=" + playerChain +
                '}';
    }
}