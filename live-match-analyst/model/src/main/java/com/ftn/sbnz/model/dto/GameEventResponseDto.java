package com.ftn.sbnz.model.dto;

import com.ftn.sbnz.model.models.CommentaryLine;
import com.ftn.sbnz.model.models.Score;

import java.util.List;

public class GameEventResponseDto {
    private List<CommentaryLine> commentary;
    private Score score;

    public GameEventResponseDto() {}

    public GameEventResponseDto(List<CommentaryLine> commentary, Score score) {
        this.commentary = commentary;
        this.score = score;
    }

    public List<CommentaryLine> getCommentary() { return commentary; }
    public void setCommentary(List<CommentaryLine> commentary) { this.commentary = commentary; }
    
    public Score getScore() { return score; }
    public void setScore(Score score) { this.score = score; }
}