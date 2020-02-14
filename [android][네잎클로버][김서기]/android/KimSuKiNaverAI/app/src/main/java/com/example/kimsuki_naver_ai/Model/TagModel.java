package com.example.kimsuki_naver_ai.Model;

public class TagModel {
    private String name;
    private VoiceTagsModel voiceTags;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public VoiceTagsModel getVoiceTags() {
        return voiceTags;
    }

    public void setVoiceTags(VoiceTagsModel voiceTags) {
        this.voiceTags = voiceTags;
    }
}

