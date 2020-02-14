package com.example.kimsuki_naver_ai.Model;

public class AudioDetailModel {
    private String id;
    private String createdAt;
    private String file_name;
    private String file_path;
    private String phoneNumber;
    private String sch_t;
    private String sch_d;
    private String sch_p;
    private String summary;
    private String script;
    private String star;
    private String updatedAt;
    private TagModel[] tags;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSch_t() {
        return sch_t;
    }

    public void setSch_t(String sch_t) {
        this.sch_t = sch_t;
    }

    public String getSch_d() {
        return sch_d;
    }

    public void setSch_d(String sch_d) {
        this.sch_d = sch_d;
    }

    public String getSch_p() {
        return sch_p;
    }

    public void setSch_p(String sch_p) {
        this.sch_p = sch_p;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getFile_name() {
        return file_name;
    }

    public void setFile_name(String file_name) {
        this.file_name = file_name;
    }

    public String getFile_path() {
        return file_path;
    }

    public void setFile_path(String file_path) {
        this.file_path = file_path;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getScript() {
        return script;
    }

    public void setScript(String script) {
        this.script = script;
    }

    public String getStar() {
        return star;
    }

    public void setStar(String star) {
        this.star = star;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public TagModel[] getTags() {
        return tags;
    }

    public void setTags(TagModel[] tags) {
        this.tags = tags;
    }
}
