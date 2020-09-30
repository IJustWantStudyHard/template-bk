<template>
  <div>
    <el-form-item label="红包模式" prop="redpacket_type" class="activity-redpacket_type">
      <el-radio-group v-model="form.redpacket_type" :disabled="disabled" @change="updateForm('redpacket_type', $event)">
        <el-radio :label="1">随机模式</el-radio>
        <el-radio :label="2">等额模式</el-radio>
      </el-radio-group>
      <el-button v-show="form.redpacket_type===2" type="primary" icon="el-icon-plus" class="icon-add" circle @click="addSingle" />
    </el-form-item>

    <el-form-item v-show="form.redpacket_type===1" label="随机最小金额" prop="min_redpacket">
      <el-input-number v-model="form.min_redpacket" :precision="2" :step="0.1" :min="0.3" :max="5" :disabled="disabled" :controls="false" clearable @change="updateForm('min_redpacket', $event)" />
    </el-form-item>

    <el-form-item v-show="form.redpacket_type===1" label="随机最大金额" prop="max_redpacket">
      <el-input-number v-model="form.max_redpacket" :precision="2" :step="0.1" :min="0.3" :max="5" :disabled="disabled" :controls="false" clearable @change="updateForm('max_redpacket', $event)" />
    </el-form-item>

    <!-- <el-form-item v-show="form.redpacket_type===2" label="金额（￥）" prop="single_money">
        <el-select
          v-model="form.single_money"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择金额或输入金额后按回车"
          @change="singleHandle"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item> -->
    <el-form-item v-for="(item,index) in form.single_money" v-show="form.redpacket_type===2" :key="'single_money'+index" :label="`等额模式${index+1}: `" class="single_money" required>
      <el-col class="line text-center" :span="2">金额</el-col>
      <el-col :span="4">
        <el-form-item>
          <el-input-number v-model="form.single_money[index].money" :precision="2" :step="0.1" :min="0.3" :max="5" :disabled="disabled" :controls="false" clearable style="width:100%" @change="updateForm('min_redpacket', $event)" />
        </el-form-item>
      </el-col>
      <el-col class="line text-center" :span="2">概率</el-col>
      <el-col :span="4">
        <el-form-item>
          <el-input-number v-model="form.single_money[index].rate" :step="1" step-strictly :min="1" :max="100" :disabled="disabled" :controls="false" clearable style="width:100%" @change="updateForm('min_redpacket', $event)" />
        </el-form-item>
      </el-col>
      <el-col class="line text-center" :span="2"><el-button type="danger" icon="el-icon-delete" circle @click="delSingle(index)" /></el-col>
    </el-form-item>

    <!-- <div class="tip-font">
        <p>1.红包分为随机模式和等额模式，只能选择一种红包发放模式</p>
        <p>2.随机模式下，后台会根据最大金额与最小金额为用户随机生成红包</p>
        <p>3.等额模式下，后台会随机抽取金额中任一金额为用户生成红包</p>
        <p>4.微信发放红包最小为0.3，故红包金额不得小于0.3</p>
        <p>5.红包金额在0.3~5之间</p>
      </div> -->
  </div>
</template>
<script>
export default {

}
</script>
