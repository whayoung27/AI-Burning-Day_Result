package com.example.kimsuki_naver_ai.Model;

import android.net.Uri;

public class AudioModel {

    private int id; //id
    private String createdAt; //date
    private String phoneNumber; //number
    private TagModel[] tags;
    private String file_path;


    private Uri uri; //for play media
    private String date;

    public String getFile_path() {
        return file_path;
    }

    public void setFile_path(String file_path) {
        this.file_path = file_path;
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public TagModel[] getTags() {
        return tags;
    }

    public void setTags(TagModel[] tags) {
        this.tags = tags;
    }

    public Uri getUri() {
        return uri;
    }

    public void setUri(Uri uri) {
        this.uri = uri;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

}
