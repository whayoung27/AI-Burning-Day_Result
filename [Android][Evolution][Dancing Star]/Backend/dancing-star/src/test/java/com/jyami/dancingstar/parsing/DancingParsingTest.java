package com.jyami.dancingstar.parsing;

import org.junit.jupiter.api.Test;

import java.util.List;

import static com.jyami.dancingstar.parsing.DancingParsing.stringToStringList;
import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;

/**
 * Created by jyami on 2020/02/14
 */
class DancingParsingTest {
    @Test
    void stringToStringListTest() {
        String string = "hello\nhi";
        List<String> strings = stringToStringList(string);
        assertThat(strings.get(0)).isEqualTo("hello");
        assertThat(strings.get(1)).isEqualTo("hi");

    }
}